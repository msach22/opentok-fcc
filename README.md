# OpenTok FCC Demo Application

A demo application demonstrating the usage of the [OpenTok API](https://tokbox.com/developer).

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/msach22/opentok-fcc/tree/master)

# Overview

This sample application shows how to connect to an OpenTok session, publish a stream, and subscribe to a stream in a basic web application.

## Quick Start
1. Get values for your OpenTok API Key and API Secret.

2. `$ npm install`

3. `export API_KEY={API_KEY}` // obtained from your TokBox account

4. `export API_SECRET={API_SECRET}` // obtained from your TokBox account

5. `$ npm start`

*Important:* Read the following sections of the of the README file to get started

## Installing Dependencies with `npm`

`$ npm install`

## Getting an OpenTok session ID, token, and API key

An OpenTok session connects different clients letting them share audio-video streams and send
messages. Clients in the same session can include iOS, Android, and web browsers.

**Session ID** -- Each client that connects to the session needs the session ID, which identifies
the session. Think of a session as a room, in which clients meet. Depending on the requirements of
your application, you will either reuse the same session (and session ID) repeatedly or generate
new session IDs for new groups of clients.

**Token** -- The client also needs a token, which grants them access to the session. Each client is
issued a unique token when they connect to the session. Since the user publishes an audio-video
stream to the session, the token generated must include the publish role (the default). For more
information about tokens, see the OpenTok [Token creation
overview](https://tokbox.com/opentok/tutorials/create-token/).

**API key** -- The API key identifies your OpenTok developer account.

## Connecting to the session

First, this method initializes a Session object:

    // Set Credentials
    const apiKey = "";
    const sessionId = "";
    const token = "";

Upon obtaining the session ID, token, and API, we initialize the session.

    // Initialize Session Object
    const session = OT.initSession(apiKey, sessionId);

The `OT.initSession()` method takes two parameters -- the OpenTok API key and the session ID. It
initializes and returns an OpenTok Session object.

The `connect()` method of the Session object connects the client application to the OpenTok
session. You must connect before sending or receiving audio-video streams in the session (or before
interacting with the session in any way). The `connect()` method takes two parameters -- a token
and a completion handler function:

    // Connect to the Session
    session.connect(token, (error) => {
      
      // If the connection is successful, initialize a publisher and publish to the session
      if (error) {
        return console.log(`There was an error connecting to session: ${error}`);
      } else {
        // Create a publisher
        // Publish
      }
    });


An error object is passed into the completion handler of the `session.connect()` method if the
client fails to connect to the OpenTok session. Otherwise, no error object is passed in, indicating
that the client connected successfully to the session.

The Session object dispatches a `streamDestroyed` event when the stream is Destroyed. The application defines an event handler for this event:
```
  session.on({
    streamCreated: (event) => {
      session.subscribe(event.stream, 'subscriber', (error) => {
        if (error) {
          console.log(`There was an issue subscribing to the stream ${event}`);
        }
      });
    }
  });
```

## Publishing an audio video stream to the session

Upon successfully connecting to the OpenTok session (see the previous section), the application
initializes an OpenTok Publisher object and publishes an audio-video stream to the session. This is
done inside the completion handler for the connect() method, since you should only publish to the
session once you are connected to it.

The Publisher object is initialized as shown below. The `OT.initPublisher()` method takes three
optional parameters:

* The target DOM element or DOM element ID for placement of the publisher video
* The properties of the publisher
* The completion handler

```
  const publisher = OT.initPublisher('publisher', (error) => {
    if (error) {
      return console.log(`There was an error initializing the publisher: ${error}`);
    }
  });

```

Once the Publisher object is initialized, we publish to the session using the `publish()`
method of the Session object:

```
  session.publish(publisher, (error) => {
    if (error) {
      return console.log(`There was an error when trying to publish: ${error}`);
    }
  });
```
## Subscribing to another client's audio-video stream

The Session object dispatches a `streamCreated` event when a new stream (other than your own) is
created in a session. A stream is created when a client publishes to the session. The
`streamCreated` event is also dispatched for each existing stream in the session when you first
connect. This event is defined by the StreamEvent object, which has a `stream` property,
representing stream that was created. The application adds an event listener for the
`streamCreated` event and subscribes to all streams created in the session using the
`session.subscribe()` method:

```
    // Subscribe to a newly created stream
    session.on({
      streamCreated: (event) => {
        session.subscribe(event.stream, 'subscriber', (error) => {
          if (error) console.log(`There was an issue subscribing to the stream ${error}`);
        });
      }
    });
```
The `session.subscribe()` method takes four parameters:

* The Stream object to which we are subscribing to
* The target DOM element or DOM element ID (optional) for placement of the subscriber video
* A set of properties (optional) that customize the appearance of the subscriber view
* The completion handler function (optional) that is called when the method completes
  successfully or fails

## Running the application

`$ npm start`
