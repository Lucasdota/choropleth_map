import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let countyData
let educationData

const width = 960;	
const height = 600;	

const tooltip = d3.select("#tooltip");
const svg = d3.select("main")
							.append("svg")
							.attr("width", width)
							.attr("height", height);

const drawLegend = () => {
	const dataArray = [15, 30, 45, 60];

  svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", "translate(620,0)")
    .selectAll("rect")
    .data(dataArray)
    .enter()
    .append("rect")
    .attr("x", (i) => i * 2.7)
    .attr("y", 40)
    .attr("width", 41.25)
    .attr("height", 20)
    .attr("fill", (d) => {
      if (d === 15) {
        return "tomato";
      } else if (d === 30) {
        return "orange";
      } else if (d === 45) {
        return "lightgreen";
      } else {
        return "limegreen";
      }
    });

  svg
    .append("g")
    .attr("transform", "translate(620,35)")
    .selectAll("text")
    .data(dataArray)
    .enter()
    .append("text")
    .text((d) => `${d}%`)
    .attr("x", (i) => i * 2.95)
    .attr("y", 38)
    .attr("fill", "white");

}

const drawMap = () => {
	svg.selectAll('path')
		 .data(countyData)
		 .enter()
		 .append('path')
		 .attr('d', d3.geoPath())
		 .attr('class', 'county')
		 .attr('fill', (item) => {
				let id = item.id;
				let county = educationData.find((d) => {
					return d.fips === id
				})
				let percentage = county.bachelorsOrHigher;
				if(percentage <= 15){
					return 'tomato'
				}else if(percentage <= 30){
					return 'orange'
				}else if(percentage <= 45){
					return 'lightgreen'
				}else{
					return 'limegreen'
				}
		 })
		 .attr('data-fips', (countyDataItem) => {
			return countyDataItem.id
		 })
		 .attr('data-education', (countyDataItem) => {
			let county = educationData.find((d) => {
				let id = countyDataItem.id;
        return d.fips === id;
      });
      let percentage = county.bachelorsOrHigher;
			return percentage
		 })
		 .on('mouseover', (e, countyDataItem) => {
				tooltip.style('opacity', 0.9);
				let id = countyDataItem.id;
				let county = educationData.find((d) => {  
          return d.fips === id;
        });
				tooltip
          .text(
            county.area_name +
              ", " +
              county.state +
              ": " +
              county.bachelorsOrHigher +
              "%"
          )
          .attr("data-education", county.bachelorsOrHigher)
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY - 28 + "px");	
		 })
		 .on('mouseout', (countyDataItem) => {
				tooltip.style("opacity", 0)
		 })

		 tooltip.attr('data-education', () => {		
				let id = countyDataItem.id;
        let county = educationData.find((d) => {
          return d.fips === id;
        });
				return county.bachelorsOrHigher
		 })
}

d3.json(countyURL).then(
	(data, error) => {
		if(error){
			console.log(error)
		}else{
			countyData = topojson.feature(data, data.objects.counties).features

			console.log(countyData);
			d3.json(educationURL).then(
				(data, error) => {
					if(error){
						console.log(error)
					}else{
						educationData = data;
						console.log(educationData);
						drawLegend();
						drawMap();
					}
				}
			)
		}
	}
)