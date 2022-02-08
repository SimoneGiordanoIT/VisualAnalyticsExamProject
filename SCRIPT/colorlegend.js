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
        d.Low_bone_mineral_density = +d.Low_bone_mineral_density; //dimenticato il piu
        d.Air_pollution = +d.Air_pollution;
        d.Outdoor_air_pollution = +d.Outdoor_air_pollution;
        d.Diet_high_in_sodium = +d.Diet_high_in_sodium;
        d.Diet_low_in_whole_grains = +d.Diet_low_in_whole_grains; //aggiunto
    });

    let Array_Deaths = ["Unsafe_water_source","Unsafe_sanitation","Household_air_pollution_from_solid_fuels","Child_wasting","Low_birth_weight_for_gestation",
        "Secondhand_smoke","Alcohol_use","Drug_use","Diet_low_in_fruits","Unsafe_sex","High_fasting_plasma_glucose","High_body_mass_index","High_systolic_blood_pressure",
        "Smoking","Iron_deficiency","Vitamin_A_deficiency","Low_bone_mineral_density","Air_pollution","Outdoor_air_pollution","Diet_high_in_sodium","Diet_low_in_whole_grains"]; //grains da togliere?
    //21
    let Countries =["Albania","Austria","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France",
        "Germany","Greece","Hungary","Iceland","Ireland","Italy","Latvia","Lithuania","Luxembourg","Macedonia","Malta","Moldova","Montenegro","Netherlands",
        "Norway","Poland","Portugal","Romania","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","Ukraine","United Kingdom"];  //39  //macedonia e UK messe bene  (hungary doppia rimossa)
    
    var SelectedCountries = ["Albania","Austria","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France",
    "Germany","Greece","Hungary","Iceland","Ireland","Italy","Latvia","Lithuania","Luxembourg","Macedonia","Malta","Moldova","Montenegro","Netherlands",
    "Norway","Poland","Portugal","Romania","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","Ukraine","United Kingdom"]   //è quello che mi arriva dalle checkbox
    SelectedCountries.sort() //nel caso non lo fosse

    var ColorsTest = ['#F44336','#FFEBEE','#FFCDD2','#EF9A9A','#E57373','#EF5350','#F44336','#E53935','#D32F2F','#C62828','#B71C1C','#FF8A80','#FF5252','#FF1744','#D50000','#E91E63',
    '#FCE4EC','#F8BBD0','#F48FB1','#F06292','#EC407A','#E91E63','#D81B60','#C2185B','#AD1457','#880E4F','#FF80AB','#FF4081','#F50057','#C51162','#9C27B0','#F3E5F5','#E1BEE7',
    '#CE93D8','#BA68C8','#AB47BC','#9C27B0','#8E24AA',"#FFFF00"] //39

    var screenWidth = window.innerWidth
    var screenHeight = window.innerHeight

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = (screenWidth/1.1) - margin.left - margin.right,
        height = (screenHeight/9.7) - margin.top - margin.bottom;


                
    var svg = d3.select("#colorlegend")
                .append("svg")
                .attr("id", "colorlegendSVG")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                /*.append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");*/    //forse da rimettere

    var color = d3.scaleOrdinal()
                .domain(Countries)  //non selectedCountries
                .range(ColorsTest)

    
    svg.append("text").attr("x", 700).attr("y", 20).text("COLOR LEGEND OF THE COUNTRIES").style("font-size", "20px").style("font-family", "American Typewriter, serif")   //x per posizionarlo

    var startingHighRect = 35

    for(var i = 0; i < Countries.length; i++){
        
        let country = Countries[i]
        if (country == "Bosnia and Herzegovina"){
            country = "Bosnia and H."
        }
        
        if (i < Countries.length * (1/3)){
            svg.append("rect").attr("x", 130 * i).attr("y",startingHighRect).attr("width", 15).attr("height", 15).style("fill", color(country))
            svg.append("text").attr("x", 20 + (130 * i)).attr("y", startingHighRect + 10).text(country).style("font-size", "14px").attr("alignment-baseline","middle")
        }

        if ((Countries.length * (1/3)) <= i && i < (Countries.length * (2/3))){
            svg.append("rect").attr("x", 130 * (i - (Countries.length * (1/3)))).attr("y",startingHighRect + 20).attr("width", 15).attr("height", 15).style("fill", color(country))
            svg.append("text").attr("x", 20 + (130 * (i - (Countries.length * (1/3))))).attr("y", startingHighRect + 30).text(country).style("font-size", "14px").attr("alignment-baseline","middle")
        }

        if (i >= Countries.length * (2/3)){
            svg.append("rect").attr("x", 130 * (i - (Countries.length * (2/3)))).attr("y", startingHighRect + 40).attr("width", 15).attr("height", 15).style("fill", color(country))
            svg.append("text").attr("x", 20 + (130 * (i - (Countries.length * (2/3))))).attr("y", startingHighRect + 50).text(country).style("font-size", "14px").attr("alignment-baseline","middle")
        }
        
    }

    


});