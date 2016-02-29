(function() {
  var SYSTEM_QUERY_TYPE = '-system-query';
  var SYSTEM_TYPE = '-system';
  var PAYLOAD_TYPE = '-payload';
  var GUID = 1;

  function Payload(data) {
    this.type = PAYLOAD_TYPE;
    this.id = 'ui-' + (GUID++);
    this.data = data;
  }

  function PayloadData(i) {
    this.name = 'worker-test-obj-' + i;
  }

  function WorkerTest(options) {
    var worker = new Worker(options.worker);
    this.worker = worker;
    this.log = options.log;
    this.requests = {};
    this.tests = [];
    var _test = this;

    worker.onmessage = function _onMessageReceive() {
      _test._handle.apply(_test, arguments);
    };
  }

  WorkerTest.prototype._send = function _sendWorkerData(data, buffers) {
    if (buffers) {
      this.worker.postMessage(data, buffers);
    } else {
      this.worker.postMessage(data);
    }
  };

  WorkerTest.prototype._handle = function _handleWorkerData(data) {
    if (data.requestId) {
      if (this.requests[data.requestId]) {
        this.requests[data.requestId].resolve(data);
      }
    }
  };

  WorkerTest.prototype._sendRequest = function _sendWorkerRequest(data, buffers) {
    var requestId = 'ui-request-' + (GUID++);
    var deferred = RSVP.defer();
    data.requestId = requestId;
    requests.requestId = deferred;
    this._send(data, buffers);
    return deferred.promise;
  };

  WorkerTest.prototype.detectFeatures = function _detectWorkerFeatures() {
    var _test = this;
    return new RSVP.Promise(function(resolve) {
      var features = {
        strings: true,
        json: false,
        cloning: false,
        transferable: false,
        channels: false
      };

      // check JSON transfer
      try {
        _test._send({
          type: SYSTEM_QUERY_TYPE,
          name: 'json-transfer',
          data: { name: 'JSON usability test' }
        });
        features.json = true;
      } catch (e) {
        // Worker does not support anything but strings
      }

      if (features.json) {
        //detect Structured Cloning and Transferable Objects
        if (typeof ArrayBuffer !== 'undefined') {
          try {
            const ab = new ArrayBuffer(1);

            _test._send({
              type: SYSTEM_QUERY_TYPE,
              name: 'buffer-transfer',
              data: ab
            }, [ab]);

            // if the byteLength is 0, the content of the buffer was transferred
            features.transferable = !ab.byteLength;
            features.cloning = !features.transferable;

          } catch (e) {
            // neither feature is available
          }
        }
      }

      // check channels
      if (typeof MessageChannel !== 'undefined') {
        features.channels = true;
      }

      resolve(features);
    });
  };

  WorkerTest.prototype.initializeWorker = function _initializeWorker() {
    return this._sendRequest({
      type: SYSTEM_TYPE,
      name: 'worker-config',
      data: { id: 'worker-' + (GUID++) }
    });
  };

  WorkerTest.prototype.runTest = function _testWorker() {

  };

  WorkerTest.prototype.runTests = function _runWorkerTests() {

  };

  // export this
  this.WorkerTest = WorkerTest;

  function StringTest(worker) {}
  function JsonTest(worker) {}
  function CloningTest(worker) {}
  function TransferableTest(worker) {}

  function ChannelStringTest(worker) {}
  function ChannelJsonTest(worker) {}
  function ChannelCloningTest(worker) {}
  function ChannelTransferableTest(worker) {}

})(window);
