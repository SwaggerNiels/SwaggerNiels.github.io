//Multi Markers WebAR-AR.js and Aframe - Playing the Archive - Connected Environment CASA-UCL

//Global Variable
var markersURLArray=[];
var markersNameArray=[];

AFRAME.registerComponent('markers_start',{
	init:function(){
		console.log('Add markers to the scene');

		var sceneEl = document.querySelector('a-scene');
		
		//list of the markers
		for(var i=1; i<19; i++)
		{
			var url="resources/markers/pattern-Individual_Blocks-"+i+".patt";
			markersURLArray.push(url);
			markersNameArray.push('Marker_'+i);
			//console.log(url);
		}

		//marker 1 (index 0)
		var markerEl = document.createElement('a-marker');
		markerEl.setAttribute('type','pattern');
		markerEl.setAttribute('url',markersURLArray[0]);
		markerEl.setAttribute('id',markersNameArray[0]);

		markerEl.setAttribute('registerevents','');
		sceneEl.appendChild(markerEl);

		//Adding model to marker 18
		// // <a-entity scale="0.1 0.1 0.1" obj-model="obj: #chip_test-obj; mtl: #chip_test-mtl"></a-entity>
		// var modelEl = document.createElement('a-entity');
		// modelEl.setAttribute('scale','0.1 0.1 0.1');
		// modelEl.setAttribute('obj-model',{obj: '/chip_test.obj', mtl: '/chip_test.mtl'});
		// modelEl.object3D.position.set(0, 0.7, 0);
		// modelEl.object3D.rotation.set(-90, 0, 0);
		
		// markerEl.appendChild(modelEl);
		
		// <a-entity gltf-model-next="src: url(/path/to/nameOfFile.gltf);" ></a-entity>
		var gltf_modelEl = document.createElement('a-entity');
		gltf_modelEl.setAttribute('scale','0.1 0.1 0.1');
		gltf_modelEl.setAttribute('gltf-model','/model.glb');
		gltf_modelEl.object3D.position.set(0, 0.7, 0);
		gltf_modelEl.object3D.rotation.set(-90, 0, 0);
		
		markerEl.appendChild(gltf_modelEl);
		
		var textEl = document.createElement('a-entity');
		textEl.setAttribute('id','text');
		textEl.setAttribute('text',{color: 'red', align: 'center', value:markersNameArray[0], width: '5.5'});
		textEl.object3D.position.set(0, 0.7, 0);
		textEl.object3D.rotation.set(-90, 0, 0);

		markerEl.appendChild(textEl);

		for(var k=1; k<18; k++)
		{
			var markerEl = document.createElement('a-marker');
			markerEl.setAttribute('type','pattern');
			markerEl.setAttribute('url',markersURLArray[k]);
			markerEl.setAttribute('id',markersNameArray[k]);

			markerEl.setAttribute('registerevents','');
			sceneEl.appendChild(markerEl);

			//Adding text to each marker
			var textEl = document.createElement('a-entity');
			
			textEl.setAttribute('id','text');
			textEl.setAttribute('text',{color: 'red', align: 'center', value:markersNameArray[k], width: '5.5'});
			textEl.object3D.position.set(0, 0.7, 0);
			textEl.object3D.rotation.set(-90, 0, 0);

			markerEl.appendChild(textEl);
		}
	}
});


//Detect marker found and lost
AFRAME.registerComponent('registerevents', {
		init: function () {
			const marker = this.el;

			marker.addEventListener("markerFound", ()=> {
				var markerId = marker.id;
				console.log('Marker Found: ', markerId);
			});

			marker.addEventListener("markerLost",() =>{
				var markerId = marker.id;
				console.log('Marker Lost: ', markerId);
			});
		},
	});
