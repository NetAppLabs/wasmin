/**
 * Copyright 2025 NetApp Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import EventEmitter from "node:events";

const DEBUG_MODE = false;

class Readable extends EventEmitter {
  fromWeb(rs, stdin) {
    this.rs = rs;
    this.stdin = stdin;
    this.begin();
    this.td = new TextDecoder("utf-8");
  }

  //isRaw = true;

  async begin() {
    const reader = this.rs.getReader();

    let done = false;
    do {
      const res = await reader.read();
      done = res.done;
      if (DEBUG_MODE) {
        console.log("EventEmitter::begin ", res);
      }
      this.emit("data", res);
    } while (!done);

    this.emit("end");
  }

  setRawMode(mode) {
    this.stdin.setRawMode(mode);
  }

}

// Make the instance
const webRSToNodeRS = async (rs, stdin) => {
  const nodeStream = new Readable();
  nodeStream.fromWeb(rs, stdin);
  return nodeStream;
};

//process.stdin = Bun.stdin;
process.stdin = await webRSToNodeRS(Bun.stdin.stream(), process.stdin);

/*
class Writable {
  fromWeb(ws) {
    // console.log(ws);
    this.writer = ws.getReader();
  }

  async write(data) {
    if (this.ongoing) {
      await this.ongoing;
    } else {
      if (data) {
        this.writer.write(data);
      }
    }
    delete this.ongoing;
  }

  end(data) {
    if (data) {
      this.writer.write(data);
    }
    this.writer.close();
  }
}

// Make the instance
const webWSToNodeWS = async (ws) => {
  const nodeStream = new Writable();
  nodeStream.fromWeb(ws);
  return nodeStream;
};

process.stdout = await webWSToNodeWS(Bun.stdout.stream());
*/