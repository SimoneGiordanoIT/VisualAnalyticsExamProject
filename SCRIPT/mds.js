d3.csv("DATASET/Deaths_EU.csv").then(function(data){
    data.forEach(function(d){
        d["Country"] = d.Entity;
        d.Year = +d.Year; //Convert to date
        d.Unsafe_water_source = +d.Unsafe_water_source; //Convert to number
        d.Unsafe_sanitation = +d.Unsafe_sanitation;
        d.Household_air_pollution_from_solid_fuels = +d.Household_air_pollution_from_solid_fuels;
        d.Child_wasting = +d.Child_wasting;
        d.Low_birth_weight_for_gestation = +d.Low_birth_weight_for_gestation;
        d.Secondhand_smoke = +d.Secondhand_smoke;
        d.Alcohol_use = +d.Alcohol_use;
        d.Drug_use = +d.Drug_use;
        d.Diet_low_in_fruits = +d.Diet_low_in_fruits;
        d.Unsafe_sex = +d.Unsafe_sex;
        d.High_fasting_plasma_glucose = +d.High_fasting_plasma_glucose;
        d.High_body_mass_index = +d.High_body_mass_index;
        d.High_systolic_blood_pressure = +d.High_systolic_blood_pressure;
        d.Smoking = +d.Smoking;
        d.Iron_deficiency = +d.Iron_deficiency;
        d.Vitamin_A_deficiency = +d.Vitamin_A_deficiency;
        d.Low_bone_mineral_density = +d.Low_bone_mineral_density;
        d.Air_pollution = +d.Air_pollution;
        d.Outdoor_air_pollution = +d.Outdoor_air_pollution;
        d.Diet_high_in_sodium = +d.Diet_high_in_sodium;
    });

    let Array_Deaths = ["Unsafe_water_source","Unsafe_sanitation","Household_air_pollution_from_solid_fuels","Child_wasting","Low_birth_weight_for_gestation",
        "Secondhand_smoke","Alcohol_use","Drug_use","Diet_low_in_fruits","Unsafe_sex","High_fasting_plasma_glucose","High_body_mass_index","High_systolic_blood_pressure",
        "Smoking","Iron_deficiency","Vitamin_A_deficiency","Low_bone_mineral_density","Air_pollution","Outdoor_air_pollution","Diet_high_in_sodium"];

    let Countries =["Albania","Austria","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France",
                    "Germany","Greece","Hungary","Iceland","Ireland","Italy","Latvia","Lithuania","Luxembourg","Macedonia","Malta","Moldova","Montenegro","Netherlands",
                    "Norway","Poland","Portugal","Romania","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","Ukraine","United Kingdom"];
    
    
    var mylist = document.getElementById("List_Deaths");
    mylist.addEventListener('change', Change_In_MDS);

    var slider = document.getElementById("Slider_Year");
    slider.addEventListener('change', Change_In_MDS);




    function Calculate_Proximity_Matrix(year,death_sel){
        var Matrix = new Array(Countries.length);

        for (var i = 0; i < Matrix.length; i++) {
            Matrix[i] = new Array(Countries.length);
        }

        //Questi supp servono poichè loro tengono memoria della posizione precedentemente salvata nella matrice
        var suppX = 0;
        
        //Adesso bisogna ciclare fissando un valore
        for( var i = 0; i < data.length; i++ ){
            if(data[i].Year == year){
                var Num_Deaths_of_Country_for_year = data[i][death_sel];
                var suppY = 0;
                
                if(suppX <=Matrix.length){
                    for(var j=0; j < data.length;j++){
                    
                        if(data[j].Year == year){
                            var Num_Value_To_Subtract_of_another_Country =  data[j][death_sel];
                            var Proximity = Math.abs(Num_Deaths_of_Country_for_year - Num_Value_To_Subtract_of_another_Country);

                            Matrix[suppX][suppY] = Proximity;

                            suppY++;    
                        }
                    }

                }
                
                suppX++;
                                
            }
        }
        return Matrix

    }


    function mds_classic(distances, dimensions) {
    
        // square distances
        var M = numeric.mul(-.5, numeric.pow(distances, 2));

        // double centre the rows/columns
        function mean(A) { return numeric.div(numeric.add.apply(null, A), A.length); }
        var rowMeans = mean(M),
            colMeans = mean(numeric.transpose(M)),
            totalMean = mean(rowMeans);

        for (var i = 0; i < M.length; ++i) {
            for (var j =0; j < M[0].length; ++j) {
                M[i][j] += totalMean - rowMeans[i] - colMeans[j];
            }
        }

        // take the SVD of the double centred matrix, and return the
        // points from it
        var ret = numeric.svd(M),
            eigenValues = numeric.sqrt(ret.S);
        return ret.U.map(function(row) {
            return numeric.mul(row, eigenValues).splice(0, dimensions);
        });
    };

    
    function Check_Country(d,row_of_arr,arr_of_data){

        for(var i=0; i<arr_of_data.length; i++){
            if(row_of_arr[0]== arr_of_data[i][0] && row_of_arr[1]== arr_of_data[i][1]){
                return Countries[i];
            }

        }

    }
    
    
    
    function Change_In_MDS(){

        MARGIN = 50;
        height = 300;
        width = 500;

        var death_Selected = mylist.options[mylist.selectedIndex].value;
        var year_Selected = document.getElementById("Slider_Year").value;

        let svg = d3.select("#mds").append("svg")
                            .attr("width", width)
                            .attr("height", height);

        var Matrix;
        Matrix = Calculate_Proximity_Matrix(year_Selected,death_Selected);

        points_data = mds_classic(Matrix,2);

        //console.log(points_data)

        //Calculate the min and max of the x axis in points_data
        min_x = d3.min(points_data, function(d) {
            return d[0];
        });
        
        max_x = d3.max(points_data, function(d) {
            return d[0];
          });
        
        //Calculate the min and max of the y axis in points_data
        min_y = d3.min(points_data, function(d) {
            return d[1];
            });
    
        max_y = d3.max(points_data, function(d) {
            return d[1];
            });

        x = d3.scaleLinear()
                    .domain([max_x, min_x])
                    .range([MARGIN, width - MARGIN]);

        y = d3.scaleLinear()
                    .domain([min_y, max_y])
                    .range([MARGIN, height - MARGIN]);


        //Per ogni paese fissato dal primo ciclo (source), si calcolano le distanze di source dai successivi paesi (target). 
        //Le distanze sono i valori di prossimità calcolati con l'MDS
        
        links_data = [];

        //forEach automaticamente preleva i dati e l'indice che è possibile utilizzare con function

        points_data.forEach(function(p1, i1) {
            var array = [];
            points_data.forEach(function(p2, i2) {
                //!==	not equal value or not equal type
                if (i1 !== i2) {
                return array.push({
                    source: p1,
                    target: p2,
                    dist: Matrix[i1][i2]
                });
                }
            });
            return links_data = links_data.concat(array);
            });

            
        
        var brush = d3.brush()
            .extent( [ [0,0], [width,height] ] )
            .on("start brush",function(d){
                var Countries_Brushed = ["String_Del"]
                var Starting_x = d.selection[0][0]
                var Starting_y = d.selection[0][1]
                var Final_x = d.selection[1][0]
                var Final_y = d.selection[1][1]

                for(var i=0;i<points_data.length;i++){
                    var x_Point = x(points_data[i][0])
                    var y_point = y(points_data[i][1])
                    
                    if(Starting_x <= x_Point && Starting_y <= Final_y){
                        if(Final_x >= x_Point && Final_y >= y_point){
                            var name_Country = Check_Country(Starting_x,points_data[i],points_data);
                            Countries_Brushed.push(name_Country)
                        }
                    }
                    
                }

                d3.selectAll("hidden").remove();
                var hidden_countries_for_brushing = d3.select("body")
                                        .data(Countries_Brushed)
                                        //Questo .enter cicla sugli elementi in data
                                        .enter()
                                        .append("hidden")
                                        .attr("id",function(d){
                                            for(var i=0;i<Countries_Brushed.length;i++){
                                                if(d==Countries_Brushed[i]){
                                                    return "Selected_Country_" + i
                                                }
                                            }
                                        })
                                        .attr("value",function(d){
                                                return d
                                        })
                var Variable_of_Number_Country_Sel = document.getElementById("number_of_Country_Selected");
                Variable_of_Number_Country_Sel.setAttribute("value", Countries_Brushed.length-1);                        
                /*var Variable_of_Number_Country_Sel = d3.select("body")
                                                        .append("input")
                                                        .attr("type","hidden")
                                                        .attr("id","number_of_Country_selected")
                                                        .attr("value",Countries_Brushed.length-1)*/
                
            })

        svg.call(brush); 


        points = svg.selectAll('.point')
                    .data(points_data);


        var enter_points = points.enter().append('g')
                                .attr("class",'point')
                                .attr("transform",function(d) {

                                            return "translate(" + (x(d[0])) + "," + (y(d[1])) + ")";
                                            })
                                //Questo dopo fa si che posso fare sia il brush che l'hover del mouse
                                .attr("pointer-events", "all");


        

        enter_points.append('circle')
                    .attr("r",6)
                    .attr("opacity",0.5);
                    
        

        var div_Name_C = d3.select('body').append('div')   
                    .attr('id', 'Country_Name_MDS')     
                    .style('opacity', 0);
                    

        enter_points.on("mouseenter",function(d,i){
                            
                            var name_Country = Check_Country(d,i,points_data);
                            div_Name_C.transition()        
                                .duration(400)      
                                .style('opacity', .9);
                            div_Name_C.html(name_Country)
                                .style('left', d.x + 'px')     
                                .style('top', (d.y - 18) + 'px');    
                           
                        });
        enter_points.on("mouseleave",function(d){
                            div_Name_C.transition()           
                                .style('opacity', 0);
                            div_Name_C.html('')
                        });

    }

    Change_In_MDS();

});