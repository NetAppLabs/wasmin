import EventEmitter from "node:events";

const DEBUG_MODE = false;

class Readable extends EventEmitter {
  fromWeb(rs) {
    this.rs = rs;
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
      //result = res.value;
      //console.log("EventEmitter::begin result ", result);

      //s = this.td.decode(res, { stream: false });
      //console.log("EventEmitter::begin dec ", s);
      
      /*let result = new Uint8Array(0);
      const { done, value } = await reader.read();
      console.log("EventEmitter::begin ", done, value);
      if (done) {
          break;
      }
      const newResult = new Uint8Array(result.length + value.length);
      newResult.set(result);
      newResult.set(value, result.length);
      //const value = res.value;
      console.log("EventEmitter::begin ", newResult);
      */
      this.emit("data", res);
    } while (!done);

    this.emit("end");
  }
}

// Make the instance
const webRSToNodeRS = async (rs) => {
  const nodeStream = new Readable();
  nodeStream.fromWeb(rs);
  return nodeStream;
};

process.stdin = await webRSToNodeRS(Bun.stdin.stream());

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