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

//process.stdin = Bun.stdin;
process.stdin = await webRSToNodeRS(Bun.stdin.stream());

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