// Initialize Session
const session = OT.initSession(apiKey, sessionId);

// Set session event listeners
session.on({
  streamCreated: (event) => {
    session.subscribe(event.stream, 'subscriber', (error) => {
      if (error) {
        console.log(`There was an issue subscribing to the stream: ${error}`);
      }
    });
  },
  streamDestroyed: (event) => {
    console.log(`Stream with name ${event.stream.name} ended because of reason: ${event.reason}`);
  }
});

// Connect to the sessino

session.connect(token, (error) => {
  // If the connection is successful, initialize a publisher and publsih to the session
  if (error) {
    return console.log(`There was an error connecting to the session: ${error}`);
  } else {
    // Create a publisher
    const publisher = OT.initPublisher('publisher', {
      name: userName
    }, (err) => {
      if (err) {
        return console.log(`There was an error initlizing the publisher: ${err}`);
      }
    });
    session.publish(publisher, (pubError) => {
      if (pubError) {
        return console.log(`There was an error when trying to publish ${pubError}`);
      }
    });
  }
});
