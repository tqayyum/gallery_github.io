const express = require('express');
const logger = require('morgan');
const request = require('request-promise');
const exphbs  = require('express-handlebars');

const app = express();

app.use(logger('dev'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

const MultipleGalleryApi = {
	url: 'http://www.cbsnews.com/api/v1/pictures/?app=cbsnews&platform=windows&size=phone&limit=10&start=0',
	json: true
}

	app.get('/', function(req,res) {
		request(MultipleGalleryApi)
			.then(function(data) {
				var multipleGallery = normalizeMultipleGallery(data);
				res.render('multipleGallery', {image: multipleGallery.photoArr, slug:multipleGallery.slugArr, imgBySlug: multipleGallery.imgBySlug});
			})
			.catch(function(err) {
				console.log(err);
			})
	});

	function normalizeMultipleGallery(data) {
		const {
			response: {
				data: imageArr 
			}
		} = data;
		
		const photoArr = [];
		const slugArr = [];
		const imgBySlug = {};

		imageArr.forEach(function(e) {
			photoArr.push(e.images.small.path);
			slugArr.push(e.slug);
			imgBySlug[`/gallery/${e.slug}`] = e.images.small.path;
		});
		
		let result = slugArr.map(function(e) {
				return `http://www.cbsnews.com/api/v1/gallery/${e}/`
		});

		return {
			photoArr,
			result,
			imgBySlug,
		}
	}

	app.get('/gallery/:slug', function(req, res) {


		const singleGalleryApi = {
			url: `http://www.cbsnews.com/api/v1/gallery/${req.params.slug}/`,
			json: true
		}

		request(singleGalleryApi)
			.then(function(data) {
				var showData = normalizeGalleryData(data);
				res.render('gallery', showData)
			})
			.catch(function(err) {
				console.log(err);
			})
	});

	function normalizeGalleryData(data) {
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
	console.log('Are you listening');
});