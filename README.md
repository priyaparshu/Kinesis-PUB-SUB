# Kinesis-PUB-SUB
Kinesis is a fully managed streaming service. It is used for consuming and delivering real-time data. It is endlessly scalable and is used for buffering and analysing streaming data. Most common usecase for Kinesis is for Application decoupling. Kinesis essentially acts as a scalable buffer until your consumer can catch up. 
Stream : An ordered sequence of data records.
Data Records: A single unit of data(max 1 MB)
Retention Period: up to 7 days.
Producer: something that puts records into Kinesis Stream.
Consumer: something that consumes records into Kinesis Stream.
Shards: an uniquely identifiable group of data records in a stream. You write one by one but you consume in batches.
Partition: Used to group data by shards within a stream. E.g. if you were consuming from a Twitter feed and you want to make sure that all tweets from a given user end up on the same stream so that the consumer can do some kind of ordered processing.  you would use the user ID as the partition key, and makes sure that all events from a given user end up on the same shard.

In this example we have an IAM role that allows any Lambda function to have full access to Kinesis stream. We have a producer function that is scheduled for 1 minute. Here we are creating a cloudwatch schedule under the hood which will execute our lambda every one minute. We are also creatin our Kinesis Stream resource. Here we're creating a Kinesis Stream resoure called transactionstream , stream name as my_first_stream and we've given it a shard count of one. 

we are generating two random values namely sensor and reading along with current time. We create a record with these three fields. we create a recordParams with the record as Data, sensor as Partion key and StreamName. We use aws sdk to add this to Kinesis stream.

The consumer handler is configured to receive batches of 100 events.TRIM_HORIZON means start from the begining. We enabled the event notification. For each invocation we are expecting batch of records. we will iterate over the batch of records, retrieve the payload for each one and decode it using base64 buffer and then convert it to string. We then parse the payload into a JSON object.

We will then take the reading from that payload and just accumulate it and log out that accumulated total starting from zero. And once we finish processing that batch we're just going to calculate the average reading across all the sensors in that batch, by dividing the total reading by the number of events that we've just processed. Then we're going to log that out.
