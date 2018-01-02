new Promise((resolve, reject) => {
	console.log("Promise is running");
	throw 5;
	reject(55555);
}).then((resolve) => {
	console.log("Promise is resolved", resolve);
}).catch(function(err){
	console.log("In the error block", err);
});
