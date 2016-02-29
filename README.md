# WebWorker Performance Tests

This repo tests the message passing speed between the main thread and a worker thread
for each of the following situations as available:

- strings: `Worker.postMessage(<String>)`
- json transfer/structured cloning: `Worker.postMessage(<Object>)`
- transferable objects: `Worker.postMessage(<Object>, [transferables])`

- channel strings: `channel.postMessage(<String>)`
- channel json transfer/structured cloning: `channel.postMessage(<Object>)`
- channel transferable objects: `channel.postMessage(<Object>, [transferables])`

Each test is run with 2 data setups.

Also note, many data formats can be used only when not using `JSON.stringify` unless
a bespoke implementation of stringify is created. For instance, stringify misses out
in these areas:

- duplicating/transferring RegExp objects.
- duplicating/transferring Blob, File, and FileList objects.
- duplicating/transferring ImageData objects. The dimensions of the clone's CanvasPixelArray will match the original and have a duplicate of the same pixel data.
- duplicating/transferring objects containing cyclic graphs of references.

This means that even in cases where using `JSON.stringify` is marginally faster, once these
cases are accounted for it's likely to be slower.

Each test measures round trips: e.g. the time it takes to serialize, send, receive a response,
and parse the response.  This means this test is biased towards operations that expect a response,
while many good setups communicate only worker to main thread. A fair test would test
the main thread overhead of processing a response.
