// Copyright 2025 NetApp Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"sync"
	"syscall"
	"time"

	"github.com/johannesboyne/gofakes3"
	"github.com/johannesboyne/gofakes3/backend/s3afero"
	"github.com/johannesboyne/gofakes3/backend/s3mem"

	"github.com/sirupsen/logrus"
)

var fsAutoCreatePaths = false
var fsAutoCreatePathsMeta = true

type LogrusLog struct {
	log *logrus.Logger
}

type LocalServer struct {
	Directory string
}

func (l LogrusLog) Print(level gofakes3.LogLevel, v ...interface{}) {
	switch level {
	case gofakes3.LogErr:
		l.log.Errorln(v...)
	case gofakes3.LogWarn:
		l.log.Warnln(v...)
	case gofakes3.LogInfo:
		l.log.Infoln(v...)
	default:
		panic("unknown level")
	}
}

func (server *LocalServer) StartS3ServerGofakeS3() (string, error) {
	mainBucketName := "bucket"
	awsAccessKey := "test"
	awsSecretKey := "test"
	insecure := "true"

	s3Backend, err := server.ConfigureBackend(mainBucketName)
	if err != nil {
		return "", err
	}

	slogger := logrus.New()
	logger := &LogrusLog{log: slogger}
	gofaker := gofakes3.New(s3Backend,
		//gofakes3.WithIntegrityCheck(!values.noIntegrity),
		//gofakes3.WithTimeSkewLimit(timeSkewLimit),
		//gofakes3.WithTimeSource(timeSource),
		gofakes3.WithLogger(logger),
		//gofakes3.WithHostBucket(true),
		//gofakes3.WithHostBucketBase(values.hostBucketBases.Values...),
		gofakes3.WithAutoBucket(false),
	)
	port := 9000
	hostname := "localhost"

	startServer := func() {
		handler := gofaker.Server()
		err = http.ListenAndServe(fmt.Sprintf(":%d", port), handler)
		if err != nil {
			logrus.Error("Error starting server", err)
		}
	}
	go startServer()
	s3Url := fmt.Sprintf("s3://%s:%d/%s?accessKeyId=%s&secretAccessKey=%s&insecure=%s", hostname, port, mainBucketName, awsAccessKey, awsSecretKey, insecure)
	return s3Url, nil
}

func (server *LocalServer) ConfigureBackend(mainBucketName string) (gofakes3.Backend, error) {
	directory := server.Directory
	isSingle := true
	isMem := false
	if mainBucketName != "" {
		isSingle = true
	}

	fs, err := s3afero.FsPath(directory, fsPathFlags())
	if err != nil {
		return nil, err
	}

	metaDirectory := filepath.Join(directory, "meta")
	if isSingle {
		parentDir := filepath.Dir(directory)
		metaDirectory = filepath.Join(parentDir, "meta")
	}
	metaFs, err := s3afero.FsPath(metaDirectory, fsPathFlagsMeta())
	if err != nil {
		return nil, err
	}

	single, err := s3afero.SingleBucket(mainBucketName, fs, metaFs)
	if err != nil {
		return nil, err
	}

	/*multi, err := s3afero.MultiBucket(fs)
	if err != nil {
		return nil, err
	}*/
	if isMem {
		timeSource, _, _ := timeOptions()

		backend := s3mem.New(s3mem.WithTimeSource(timeSource))
		return backend, nil
	} else if isSingle {
		return single, nil
	} else {
		return nil, errors.New("error configuring s3 server")
	}
	/* else {
		return multi, nil
	}*/
}

func timeOptions() (source gofakes3.TimeSource, skewLimit time.Duration, err error) {
	skewLimit = gofakes3.DefaultSkewLimit
	fixedTimeStr := ""
	if fixedTimeStr != "" {
		fixedTime, err := time.Parse(time.RFC3339Nano, fixedTimeStr)
		if err != nil {
			return nil, 0, err
		}
		source = gofakes3.FixedTimeSource(fixedTime)
		skewLimit = 0
	}

	return source, skewLimit, nil
}

func fsPathFlags() (flags s3afero.FsFlags) {
	if fsAutoCreatePaths {
		flags |= s3afero.FsPathCreateAll
	}
	return flags
}

func fsPathFlagsMeta() (flags s3afero.FsFlags) {
	if fsAutoCreatePathsMeta {
		flags |= s3afero.FsPathCreateAll
	}
	return flags
}

func main() {
	if len(os.Args) > 1 {
		dir := os.Args[1]
		localServer := &LocalServer{Directory: dir}
		s3url, err := localServer.StartS3ServerGofakeS3()
		if err != nil {
			fmt.Println("Error starting: ", err)
		}
		fmt.Println("Starting s3 server on ", s3url)
		wg := &sync.WaitGroup{}

		signalChannel := make(chan os.Signal, 1)
		signal.Notify(signalChannel, syscall.SIGTERM, syscall.SIGINT)
		theSignal := <-signalChannel
		log.Printf("Received signal: %s, waiting for all messages to finish enqueueing.", theSignal)
		wg.Wait()
		log.Println("All messages have been enqueued.")
		os.Exit(0)
	} else {
		fmt.Println("Error starting: Please give server directory as argument ")
	}
}
