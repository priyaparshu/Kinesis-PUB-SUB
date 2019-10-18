# Kinesis-PUB-SUB
Kinesis is a fully managed streaming service. It is used for consuming and delivering real-time data. It is endlessly scalable and is used for buffering and analysing streaming data. Most common usecase for Kinesis is for Application decoupling. Kinesis essentially acts as a scalable buffer until the consumer can catch up. 

Key concepts:

Stream : An ordered sequence of data records.
Data Records: A single unit of data(max 1 MB)
Retention Period: up to 7 days.
Producer: something that puts records into Kinesis Stream.
Consumer: something that consumes records into Kinesis Stream.
Shards: an uniquely identifiable group of data records in a stream. You write one by one but you consume in batches.
Partition: Used to group data by shards within a stream. E.g. if you were consuming from a Twitter feed and you want to make sure that all tweets from a given user end up on the same stream so that the consumer can do some kind of ordered processing. You would use the user ID as the partition key, and makes sure that all events from a given user end up on the same shard.

In this example I have an IAM role that allows any Lambda function to have full access to Kinesis stream. I have a producer function that is scheduled for 1 minute. Here I am creating a cloudwatch schedule under the hood which will execute our lambda every one minute. I am also creating a Kinesis Stream resource called transactionstream , stream name as "my_first_stream" and with shard count of one. 

I am generating two random values namely sensor and reading along with current time. I created a record with these three fields. I created a recordParams with record as Data, sensor as Partion key and StreamName. I use aws sdk to add this to Kinesis stream.

The consumer handler is configured to receive batches of 100 events. TRIM_HORIZON means start from the begining. I also enabled the event notification. For each invocation I am expecting batch of records. I will iterate over the batch of records, retrieve the payload for each one and decode it using base64 buffer and then convert it to string. I then parse the payload into a JSON object.

I then take the reading from that payload and just accumulate it and log out that accumulated total starting from zero. And once I finish processing that batch I am just going to calculate the average reading across all the sensors in that batch, by dividing the total reading by the number of events that I just processed and log that out.
