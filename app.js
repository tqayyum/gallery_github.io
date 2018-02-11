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
	url: 'https://www.cbsnews.com/api/v1/gallery/nasas-real-life-gravity-pics/',
	json: true
}

app.get('/', function(req,res) {
	request(gallery_Api)
		.then(function(data) {
			var showData = (normalizeTrackData(data));
			res.send(showData);
			//res.render('gallery');
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
					data:[ {
						images: {
							large: {
								path:
									imageUrl
							}
						}
					}]
				}
			} 
		},

		response: {
			data: {
				items: {
					data: [ {
						headline:
							dHeadline
					}]
				}
			}
		},

		response: {
			data: {
				items: {
					data: [ {
						caption:
							dCaption
					}]
				}
			}
		},

		response: {
			data: {
				items: {
					data: [ {
						photoCredit:
							dPhotoCredit
					}]
				}
			}
		},

		response: {
			data: {
				items: {
					data: [ {
						description:
							dDescription
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
	console.log('Are you listening');
});