
d3.csv("data/Kaggle_TwitterUSAirlineSentiment.csv").then( data => {

    //    process data from csv into finalData I will use in my chart.
    //    create object of objects for each of the airlines and their positive/negative/neutral tweets
        var finalData = []
        data.forEach( (d) => {
            if( finalData.some( val => val['airline'] == d['airline'] )) {
                finalData.forEach( (x) => {
                    if(x['airline'] == d['airline']) {
                        x[d['airline_sentiment']] += 1
                        x['num_tweets'] += 1
                    }
                })
            } else {
                let newKey = {}
                newKey['airline'] = d['airline']
                newKey['num_tweets'] = 1
                newKey['positive'] = 0
                newKey['negative'] = 0
                newKey['neutral'] = 0
                newKey[d['airline_sentiment']] += 1
                finalData.push(newKey)
            }
        })
    
    
        let container = document.querySelector('#svg-container')
    
        const   height = 400,
                width = 600
    
        const clear = () => {
            container.innerHTML = ''
        }
    
        const makePie = (d) => {
            // render the pie chart
            let svg = d3.select(container)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'pie-chart')
                    .attr('class', d['airline'])
                    .append('g')
                    .attr('transform', `translate(${width / 3}, ${height / 2})`)
            let radius = Math.min(width, height) / 3
    
            let color = d3.scaleOrdinal()
                        .range(['#1098F7', '#26C485', '#CE2D4F', ])
            let pie = d3.pie()
            let arc = d3.arc()
                        .innerRadius(radius * 0.5)
                        .outerRadius(radius * 0.8)
    
            let outerArc = d3.arc()
                        .outerRadius(radius)
                        .innerRadius(radius)
    
            svg.selectAll('arc')
                    .data(pie([d.positive,d.neutral,d.negative]))
                    .enter()
                    .append('path')
                    .attr('class', 'arc')
                    .attr('fill', (d,i) => color(i))
                    .attr('d', arc)
                    .attr('data-bs-toggle', 'tooltip')
                    .attr('data-bs-placement', 'left')
                    .attr('title', (d) => d.data)
    
            svg.selectAll('polyline')
                .data(pie([d.positive,d.neutral,d.negative]))
                .enter()
                .append('polyline')
                .attr('stroke', 'grey')
                .style('fill', 'none')
                .attr('stroke-width', 2 )
                .attr('points',(d) => {
                    let a = arc.centroid(d), 
                        b = outerArc.centroid(d)
                    
                    return [a,b]
                })
            svg.selectAll('.label')
                .data(pie([d.positive,d.neutral,d.negative]))
                .enter()
                .append('text')
                .text((x) => {
                   return `${Math.round(x.data / d.num_tweets * 100)}%`
                })
                .attr('transform', (d) =>{
                    return `translate(${outerArc.centroid(d)[0]*1.2}, ${outerArc.centroid(d)[1]* 1.1})`
                })
                .attr('text-anchor', 'middle')
                .attr("dominant-baseline", "central")
    
            let legend = svg.selectAll('.legend')
                        .data(pie(['positive', 'neutral', 'negative']))
                        .enter().append('g')
                        .attr('transform', (d,i) => {
                            return `translate( ${width / 2.5}, ${i * 25 - 40})`
                        })
                        .attr('class', 'legend')
            legend.append('rect')
                .attr('width', 20)
                .attr('height', 20)
                .attr('fill', (d,i) => color(i))
            legend.append('text')
                .text((d) => d.data)
                .attr('x', 25)
                .attr('y', 10)
                .attr('font-size', 20)
                .attr('fill', 'grey')
                .attr("dominant-baseline", "central")
        }
    
        // append each airline to the HTML select element for toggling the chart
        let select = document.querySelector('#airline-select')
        finalData.forEach( d => {
            let option = document.createElement('option')
            option.textContent = d['airline']
            option.setAttribute('value', d['airline'])
            select.appendChild(option)
        })
    
        // current pie chart will be toggled using the select element
        select.addEventListener('change', (e) => {
            // Call clear function to remove previous pie chart
            clear()
            // find airline data using the value of select element & call pie func
            finalData.forEach(element => {
                if (element['airline'] == e.target.value) {
                makePie(element)
                }
            })
        })
    
        makePie(finalData[0])
    });