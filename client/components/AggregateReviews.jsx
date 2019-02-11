import React from 'react';

// generate object of ratings for a given property
var collectRatings = (arr, property, isReviewProperty) => {
	var ratings = { '1':null, '2':null, '3':null, '4':null, '5':null };
	arr.forEach(review => {
		if (isReviewProperty) {
			ratings[review.review[property]] = ratings[review.review[property]] ? ratings[review.review[property]] + 1 : 1;
		} else {
			ratings[review[property]] = ratings[review[property]] ? ratings[review[property]] + 1 : 1;
		}
	});
	return ratings;
};

// delete unwanted property from object
var neuter = (obj, property) => {
	var clone = Object.assign({}, obj);
	delete clone[property];
	return clone;
};

// helper function
var avg = (arr) => {
	return arr.reduce((acc, cur) => acc + cur) / arr.length;
};

// helper function
var sum = (arr) => {
	return arr.reduce((acc, cur) => acc + cur);
};

// SVG template for rating stars
var star = (color) => ( 
	<svg height="16px" width="16px" viewBox="-1 -1 2 2">
	  <polygon points="0,-1 .588,.809 -.95,-.31 .95,-.31 -.588,.809"
	  fill={color} />
	</svg>
);

// genererate dynamic-width star rating
var fillStars = (red, percentage) => {
	var stars = Array(5);
	stars.fill(star('crimson'), 0, red);
	stars.fill(star('lightGray'), red);
	return (
		<div className='dynamicWidth' style={{'width': `${percentage}%`}}>
			{stars}
		</div>
	);
};

var AggregateReviews = (props) => {
	var metrics = props.reviews.map(review => neuter(review.review, 'post'));
	var averageMetrics = {};
	metrics.forEach(metric => {
		var keys = Object.keys(metric);
		for (var key of keys) {
			averageMetrics[key] = averageMetrics[key] ? averageMetrics[key] + metric[key] : metric[key];
		}
	});
	var averageMetricKeys = Object.keys(averageMetrics);
	for (var averageMetricKey of averageMetricKeys) {
		averageMetrics[averageMetricKey] /= props.reviews.length;
		averageMetrics[averageMetricKey] = averageMetrics[averageMetricKey].toFixed(1);
	}
	var stars = collectRatings(props.reviews, 'stars', false);
	var totalStars = Object.keys(stars).reduce((acc, cur) => {
		return acc + Number(stars[cur]);
	}, 0);
	var starsProportion = {};
	Object.keys(stars).forEach(key => {
		starsProportion[key] = stars[key] / totalStars * 100;
	});
	var averageStars = sum(Object.keys(stars).map(star => stars[star] * Number(star))) / sum(Object.keys(stars).map(star => stars[star]));
	return (
		<div className='reviewsSummary'>
			<div className='reviewsCount'>
				What {props.reviews.length} people are saying
			</div>
			<div className='aggregate'>
				<div className='leftAggregate'>
					<div className='description'>
						Overall ratings and reviews
					</div>
					<div className='overallStars'>
						<div className='overlay'>
							<div className='background'>
								{ fillStars(0, 100) }
							</div>
							<div className="foreground">
								{ fillStars(5, averageStars / 5 * 100) }
							</div>
						</div>
						{ (averageStars).toFixed(1) } based on recent ratings
					</div>
					<div className='metrics'>
						{
							averageMetricKeys.map(averageMetric => (
								<div className='metric'>
									<div className='metricValue'>
										{averageMetrics[averageMetric]}
									</div>
									<div className='metricName'>
										{averageMetric}
									</div>
								</div>
							))
						}
					</div>
				</div>
				<div className='aggregateStars'>
					{
						Object.keys(stars).reverse().map(star => (
							<div className='starBar'>
								<span className='star'>
									{star}
								</span>
								<div className='bar'>
									<span style={{'width': `${starsProportion[star]}%`}} className='redBar'></span>
								</div>
							</div>
						))
					}
				</div>
			</div>
		</div>
	);	
};

module.exports = AggregateReviews;