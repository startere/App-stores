function solve() {
	// Your classes
  
  function stringMustBeBetween(inputString, min, max){
      if(inputString.length < min || inputString.length > max){
        throw Error('name not valid');
      }
  }
  function isString(input){
      if(typeof input !== 'string'){
        throw Error('Input must be a string.');
      }
  }
  function numberMustBePositive(input){
      if(input <= 0){
        throw Error('Number must be positive.');
      }
  }
  function numberMustBeBetween(input, min, max){
      if(input < min || input > max){
        throw Error('Number must be different.');
      }
  }
  function inputIsUndefined(input){
      if(input === undefined){
        throw Error('No arguments passed to the function');
      }
  }
	function isNumber(input){
      if(typeof input !== 'number' || Number.isNaN(input)){
        throw Error('Input must be a number.');
      }
  }
  function invalidVersion(newVersion, oldVersion){
			if(newVersion <= oldVersion){
				throw Error('Invalid version');
			}
  }
  function isAppInstance(input){
      if(!(input instanceof App)){
        throw Error('Input is not instance of App.')
      }
  }
  function stringContainsOnlyLatinLetters(value){
			if(!(/^[a-zA-Z\d ]+$/.test(value))){
				throw Error('String should contain only latin letters, digits and blank spaces.');
			}
  }
  
  var timeOfUpload = 0;
	
	function timeGenerator(){
    timeOfUpload += 1;
    return timeOfUpload;
  }
	
	function copyApp(app){
		return {
			name: app.name,
			description: app.description,
			version: app.version,
			rating: app.rating,
			apps: app.apps
		};
	}
  
 	class App{
		constructor(name, description, version, rating){
			this._name = name;
			this._description = description;
			this._version = version;
			this._rating = rating;
      //this.timeOfUpload = undefined;
		}
		get name(){
			return this._name;
		}
		set name(value){
			stringMustBeBetween(value, 1, 24);
			stringContainsOnlyLatinLetters(value);
			this._name = value;
		}
		get description(){
			return this._description;
		}
		set description(value){
			isString(value);
			this._description = value;
		}
		get version(){
			return this._version;
		}
		set version(value){
		  isNumber(value);
			numberMustBePositive(value);
			this._version = value;
		}
		get rating(){
			return this._rating;
		}
		set rating(value){
		  isNumber(value);
			numberMustBeBetween(value, 1, 10);
			this._rating = value;
		}
		release(input){
			if(typeof input !== 'object'){
				input = {version: input};
			} 
			
			var version = input.version;
			
			inputIsUndefined(version);
			isNumber(version);
			numberMustBePositive(version);
		 
			invalidVersion(version, this.version);
			
			this.version = version;
			if(input.hasOwnProperty('description')){
				var description = input.description;
				isString(description);
				this.description = description;
			}
			
			if(input.hasOwnProperty('rating')){
				var rating = input.rating;
		    isNumber(rating);
			  numberMustBeBetween(rating, 1, 10);
				this.rating = rating;
			}
			return this;
		}
	}
  
  class Store extends App{
		constructor(name, description, version, rating){
			super(name, description, version, rating);
			this._apps = [];
		}
		
		get apps(){
			return this._apps;
		}
		
		uploadApp(app){
			isAppInstance(app);////////////////////////////////////////////////////
			var sameExistingApp = this._apps.find(a => a.name === app.name);
			if(sameExistingApp === undefined){
				this._apps.push(app);
			}
			else{
        invalidVersion(app.version, sameExistingApp.version);				
				sameExistingApp.release(app);
			}
			app.timeOfUpload = timeGenerator();
			return this;
		}
		takedownApp(name){
			var matchingApp = this._apps.find(a => a.name === name);
			if(matchingApp === undefined){
				throw Error('App not found');
			}
			this._apps.splice(this._apps.indexOf(matchingApp), 1);
		  return this;
		}
		search(pattern){
			var result = [];
			
			var matchingSubstr = pattern.toLowerCase();
			
			for(var app of this._apps){
				var appName = app.name.toLowerCase();
        
        if(appName.indexOf(matchingSubstr) !== -1){
          result.push(app);
        }
      }
			result.sort(function(a, b){return a.name > b.name});
			return result;
		}
		listMostRecentApps(count){
			if(count === undefined){
				count = 10;
			}
			var result = [];
			
      result = this._apps.sort(function(a, b){return a.timeOfUpload < b.timeOfUpload});
      			
      var countResult = [];
      
      if(count <= result.length){
        for(var i = 0; i < count; i++)
        {
          countResult[i] = result[i];
        }
      }
      else{
        for(var i = 0; i < result.length; i++)
        {
          countResult[i] = result[i];
        }
      }
			return countResult;
		}
		listMostPopularApps(count){
		  if(count === undefined){
				count = 10;
			}
			var result = [];
			
      result = this._apps.sort(function(a, b){
				if(a.rating !== b.rating){
					return a.rating < b.rating
				}
				else{
					return a.timeOfUpload < b.timeOfUpload;
				}
			});
      			
      var countResult = [];
      
      if(count <= result.length){
        for(var i = 0; i < count; i++)
        {
          countResult[i] = result[i];
        }
      }
      else{
        for(var i = 0; i < result.length; i++)
        {
          countResult[i] = result[i];
        }
      }
			return countResult;
		}
	}
  
  class Device{
		constructor(hostname, apps){
			this._hostname = hostname;
			this._apps = apps;
			this._stores = apps.filter(app => app instanceof Store).map(store => copyApp(store));
		}
		get hostname(){
			return this._hostname;
		}
		set hostname(value){
			stringMustBeBetween(value, 1, 32);
			this._hostname = value;
		}
		get apps(){
			return this._apps;
		}
		set apps(value){
			if(value.length === 0){
				throw Error('No apps passed to function.');
			}
			
			for(var app of value){
				isAppInstance(app);
			}
			this._apps = value;
		}
		search(pattern){
      var result = [];
      
			var matchingSubstr = pattern.toLowerCase();
			
		  for(var store of this._apps){
				  if(store.apps !== undefined){
						for(var app of store._apps){
							var appName = app.name.toLowerCase();
        
              if(appName.indexOf(matchingSubstr) !== -1){
                result.push(app);
						}
          }
				}
			}
			
			result.sort(function(a, b){return a.name > b.name});
			
			result.sort(function(a, b){
				if(a.name === b.name){
					return a.version < b.version;
				}
			});
			
			for(var i = 0; i < result.length - 1; i++){
				
				if(result[i].name === result[i + 1].name){
					result.splice((i+1), 1);
				}
			}
			return result;
		}
		install(name){

			var matchingApps = [];
					
		  for(var store of this._apps){
				  if(store.apps !== undefined){
						for(var app of store._apps){				
              if(app.name === name){
                matchingApps.push(app);
						}
          }
				}
			}
			
			matchingApps.sort(function(a, b){return a.version < b.version});
		
			var matchingApp = matchingApps[0];
			
			
			if(matchingApp === undefined){
			  throw Error('no such app found in stores');	 
			}
			
			var appAlreadyInstalled = this._apps.find(a => a.name === matchingApp.name);
			if(appAlreadyInstalled === undefined 
				 ||
				 appAlreadyInstalled.version < matchingApp.version
				){
				this.apps.push(matchingApp);
			}
		
			return this;
			
		}
		uninstall(name){
			var appExists = this._apps.find(a => a.name === name);
			if(appExists === undefined){
				throw Error('app not installed on device');
			}
			else{
			 this.apps.splice(this._apps.indexOf(appExists), 1);
			}
			return this;
		}
		listInstalled(){
			return this._apps.sort(function(a, b){return a.name > b.name});
		}
		update(){
			for(var app of this._apps){
				//this.install(app.name);
			}
			return this;
		}
	}

	return {
		createApp(name, description, version, rating) {
			return new App(name, description, version, rating);
		},
		createStore(name, description, version, rating) {
			return new Store(name, description, version, rating);
		},
		createDevice(hostname, apps) {
			return new Device(hostname, apps);
		}
	};
}

solve();