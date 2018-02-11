const express = require('express');
const logger = require('morgan');
const request = require('request-promise');
const exphbs  = require('express-handlebars');

const app = express();

app.use(logger('dev'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

const gallery_Api = {
	url: 'https://www.cbsnews.com/api/v1/gallery/pyeongchang-olympics-opening-ceremony/',
	json: true
}

app.get('/', function(req,res) {
	request(gallery_Api)
		.then(function(data) {
			var showData = normalizeTrackData(data);
			// res.send(showData);
			res.render('gallery', showData)
		})
		.catch(function(err) {
			console.log(err);
		})
});

function normalizeTrackData(data) {
	const {
		response:{
			data:{
				items: {
					data:[{
						headline: dHeadline,
						caption: dCaption,
						photoCredit: dPhotoCredit,
						description: dDescription,
						images: {
							large: {
								path: imageUrl
							}
						}
					}]
				}
			}
		}
} = data;

	return { 
		imageUrl,
		dHeadline,
		dCaption,
		dPhotoCredit,
		dDescription
		}
}


app.listen(3000, function () {
	console.log('Are you listening here');
});