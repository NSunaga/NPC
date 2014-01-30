var NPC = NPC || {REVISION:'1'};
NPC.structuralObject = new THREE.Object3D();

//NPC.structuralObject = function (){
		console.log('NuclearPoreComplex', NPC.REVISION);
		//this.NPC = new THREE.Object3D();
		function proteinLoader(xmlPath, xmlTag, numProteins, proteinArray, meshPath, meshName, color, parentalObject){
			var proteinTagNo = 0;
			$.ajax({
					type: "GET",
					url: xmlPath,
					dataType: "xml",
					async:false,
					success: function(xml){
						//console.log("success");
						$(xml).find(xmlTag).each(function(){
							proteinArray[proteinTagNo] = $(this).text();
							//console.log($(this).text());
							proteinTagNo += 1;
						});
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
			            console.log(XMLHttpRequest.status);
			            console.log(textStatus);
			            console.log(errorThrown.message);
					}
			});
			
			var partNo = 1;
			var partCount = proteinArray.length + 1;
			loadUp(partNo);
			
			function loadUp(_partNo){
			    var loader = new THREE.JSONLoader();
			    loader.load(meshPath + _partNo+".js", function(geometry, materials) {
			        createPart(geometry, materials, _partNo);
			    });
			}
			
			function createPart(geometry, materials, _partNo) {
			    //create mesh etc as before
			   		var proteinMaterial = new THREE.MeshPhongMaterial({
						color: 0xFFFFFF, ambient: 0xcccccc,
						specular: 0xcccccc, shininess:2, metal:false,
						//opacity:0.7,
						//transparent:true,
						blending:THREE.NormalBlending
					});	
					var randNumber = Math.random();
					//var randColor =new Array();
					if (color == "red"){
						var randColor = new Array(1, 0, Math.random());
					}
					else if(color == "green"){
						var randColor = new Array(0, 1, Math.random());
					}
					else if(color == "blue"){
						var randColor =new Array(0, Math.random(), 1);
					}
					else if(color == "purple"){
						var randColor =new Array(Math.random()*0.5+0.5, 0, Math.random()*0.5+0.5);
					}
					else if(color == "yellow"){
						var randColor =new Array(Math.random()*0.2+0.8, Math.random()*0.2+0.8, Math.random());
					}
					else{
						console.log("undefined color" + color);
						var randColor =new Array(Math.random(), Math.random(), Math.random());
					}
					proteinMaterial.color.setRGB(randColor[0], randColor[1], randColor[2]);
					randColor[0] = randColor[0] - 0.1;
					randColor[1] = randColor[1] - 0.1;
					randColor[2] = randColor[2] - 0.1;
					proteinMaterial.ambient.setRGB(randColor[0], randColor[1], randColor[2]);
					proteinMaterial.specular.setRGB(randColor[0], randColor[1], randColor[2]);
					var proteinMesh = new THREE.Mesh(geometry, proteinMaterial);
					proteinMesh.scale = new THREE.Vector3(110, 110, 110);
					proteinMesh.position.set( 0, 0, 0 ); 
					proteinMesh.name = meshName + _partNo;
					parentalObject.add(proteinMesh);
					//console.log(parentalObject.children);
			
			    if(_partNo + 1 <= partCount){
			    	//console.log(proteinMesh.name);
			        _partNo++;
			        loadUp(_partNo); //load next part
			    }
			}
			
			var _partNoLateral = proteinArray.length + 1;
			var partCountLateral = numProteins;
			loadUpLateral(_partNoLateral);
			
			function loadUpLateral(_partNoLateral){
			    var loader = new THREE.JSONLoader();
			    loader.load(meshPath + _partNoLateral+".js", function(geometry, materials) {
			        createPartLateral(geometry, materials, _partNoLateral);
			    });
			}	
	
			function createPartLateral(geometry, materials, _partNoLateral) {
			    //create mesh etc as before
					var proteinMaterial = new THREE.MeshPhongMaterial({
					});	
					var proteinMesh = new THREE.Mesh(geometry, proteinMaterial);
					proteinMesh.scale = new THREE.Vector3(110, 110, 110);
					proteinMesh.position.set( 0, 0, 0 ); 
					proteinMesh.name = meshName + _partNoLateral;
					//console.log(proteinMesh.name);
					parentalObject.add(proteinMesh);		   		
			
			    if(_partNoLateral + 1 <= partCountLateral){
			    	//console.log(String(_partNoLateral) + " " + String(partCountLateral));
			    	//console.log(proteinMesh.name);
			        _partNoLateral++;
			        loadUpLateral(_partNoLateral); //load next part
			    }
			}
	
		}
		var centralPoreProteins = new Array();
		proteinLoader("CentralPoreTest.xml", "protein", 31, centralPoreProteins, 'CP/cp', "cpPM","red", NPC.structuralObject);
		var cytoplasmicRingProteins = new Array();
		proteinLoader("CytoplasmicRingTest.xml", "protein", 7, cytoplasmicRingProteins, 'CR/cpr', "cprPM","green", NPC.structuralObject);
		var nuclearRingProteins = new Array();
		proteinLoader("NuclearRingTest.xml", "protein", 8, nuclearRingProteins, 'NR/nr', "nrPM","blue", NPC.structuralObject);
		var filamentsProteins = new Array();
		proteinLoader("FilamentsTest.xml", "protein", 33, filamentsProteins, "Filaments/f", "filPM", "yellow", NPC.structuralObject);
		var nuclearBascketProteins = new Array();
		proteinLoader("NuclearRingTest.xml", "protein",10, nuclearBascketProteins,"NBF/nbf", "nbfPM", "purple", NPC.structuralObject);
		var nuclearBascketRingProteins = new Array();
		proteinLoader("NuclearRingTest.xml", "protein", 12, nuclearBascketRingProteins, "NBR/nbr", "nbrPM", "purple", NPC.structuralObject)

	//var controls = new THREE.OrbitControls(camera);
	//controls.center = new THREE.Vector3(0, 0, 0);
	var mouseX = -1, mouseY = -1;
	document.addEventListener('mousemove', function(e) {
		mouseX = (e.clientX / window.innerWidth ) *  2 - 1;
		mouseY = (e.clientY / window.innerHeight) * -2 + 1;
	}, false);	
	var prntObject = NPC.structuralObject;
	function render() {
		requestAnimationFrame(render);
		//controls.update();
		var projector = new THREE.Projector();
		var pos = new THREE.Vector3(mouseX, mouseY, -1);
		var ray = projector.pickingRay(pos, camera);
		var intersects = ray.intersectObjects(prntObject.children);
		
		function disActivate(){
	        for(var t = 0; t < prntObject.children.length; t++) {
	        	var objChildren = prntObject.children[t];
	            var lObject = prntObject.children[t];
	                if(lObject.material!=undefined && lObject.name != intersects[0].object.name){
		            	lObject.material.emissive = new THREE.Color(0);
	                }
	        }			
		}

		if(intersects.length > 0 && (intersects[0].object.name).substring(-1, 4) == "cpPM") {
			var No = (intersects[0].object.name).substring(4, 6);
			var object = prntObject.getObjectByName(intersects[0].object.name);
			//console.log(intersects[0].object.name);
	        No = parseInt(No);
	        object.material.emissive = new THREE.Color(0x888888);
	        
	        if(centralPoreProteins[No-1]){
		        h2Elem.innerHTML = String(centralPoreProteins[No-1]);
	        }
	        else{
		        h2Elem.innerHTML = "empty"
	        }
	        h1Elem.innerHTML = "Central Pore"
	        disActivate();

		}
		else if(intersects.length > 0 && (intersects[0].object.name).substring(-1, 5) == "cprPM") {
			var No = (intersects[0].object.name).substring(5, 7);
			var object = prntObject.getObjectByName(intersects[0].object.name);
	        No = parseInt(No);
	        object.material.emissive = new THREE.Color(0x888888);
	        
	        if(cytoplasmicRingProteins[No-1]){
		        h2Elem.innerHTML = String(cytoplasmicRingProteins[No-1]);
	        }
	        else{
		        h2Elem.innerHTML = "empty"
	        }
	        h1Elem.innerHTML = "Cytoplasmic Ring"
	        
	        disActivate();
		}
		else if(intersects.length > 0 && (intersects[0].object.name).substring(-1, 4) == "nrPM") {
			var No = (intersects[0].object.name).substring(4, 6);
			var object = prntObject.getObjectByName(intersects[0].object.name);
	        No = parseInt(No);
	        object.material.emissive = new THREE.Color(0x888888);
	        
	        if(nuclearRingProteins[No-1]){
		        h2Elem.innerHTML = String(cytoplasmicRingProteins[No-1]);
	        }
	        else{
		        h2Elem.innerHTML = "empty"
	        }
	        h1Elem.innerHTML = "Nuclear Ring"
	        
	        disActivate();
		}
		else if(intersects.length > 0 && (intersects[0].object.name).substring(-1, 5) == "filPM") {
			var No = (intersects[0].object.name).substring(5, 7);
			var object = prntObject.getObjectByName(intersects[0].object.name);
	        No = parseInt(No);
	        object.material.emissive = new THREE.Color(0x888888);
	        
	        if(nuclearRingProteins[No-1]){
		        h2Elem.innerHTML = String(filamentsProteins[No-1]);
	        }
	        else{
		        h2Elem.innerHTML = "empty"
	        }
	        h1Elem.innerHTML = "Filaments"
	        
	        disActivate();
		}		
		else {
			h1Elem.innerHTML ="Nuclear Pore Complex";
		    h2Elem.innerHTML="";
			for(var t = 0; t < prntObject.children.length; t++) {
	                var lObject = prntObject.children[t];
	                if(lObject.material!=undefined){
		            	lObject.material.emissive = new THREE.Color(0);

	                }
	        }
		}
		renderer.render(scene, camera);
	};
	render();
	//}