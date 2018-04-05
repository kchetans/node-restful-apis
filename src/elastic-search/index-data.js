import UsersProfileSchema from "../mongo-models/UsersProfileSchema";

export default indexData = () => {
    let stream = UsersProfileSchema.synchronize();
    let count = 0;

    stream.on('data', function (err, doc) {
        count++;
    });

    stream.on('close', function () {
        console.log('indexed ' + count + ' documents!');
    });

    stream.on('error', function (err) {
        console.log(err);
    });
}