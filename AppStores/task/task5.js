function solve() {
	
	const Validators = {
		stringMustBeBetween(inputString, min, max){
      if(inputString.length < min || inputString.length > max){
        throw Error(`String must be between ${min} and ${max} characters long.`);
      }
      else{
        return inputString;
      }
    },
		isString(input){
      if(typeof input !== 'string'){
        throw Error('Input must be a string.');
      }
    },
    numberMustBePositive(input){
      if(input <= 0){
        throw Error(`Number must be positive.`);
      }
    },
		numberMustBeBetween(inputString, min, max){
      if(inputString < min || inputString > max){
        throw Error(`Number must be between ${min} and ${max}.`);
      }
    },
    inputIsUndefined(input){
      if(input === undefined){
        throw Error('No arguments passed to the function');
      }
    },
	  isNumber(input){
      if(typeof input !== 'number'){
        throw Error('Input must be a number.');
      }
    },
		invalidVersion(newVersion, oldVersion){
			if(newVersion <= oldVersion){
				throw Error('Invalid version');
			}
		},
    isAppInstance(input){
      if(!(input instanceof App)){
        throw Error('Input is not instance of App.')
      }
    },
		stringContainsOnlyLatinLetters(value){
			if(!(/^[a-zA-Z\d ]+$/.test(value))){
				throw Error('String should contain only latin letters, digits and blank spaces.');
			}
		}
	}
	
	var timeOfUpload = 0;
	
	function timeGenerator(){
    timeOfUpload += 1;
    return timeOfUpload;
  }
	
	class App{
		constructor(name, description, version, rating){
			this.name = name;
			this.description = description;
			this.version = version;
			this.rating = rating;
			this.timeOfUpload = undefined;
		}
		get name(){
			return this._name;
		}
		set name(value){
			//Validators.stringMustBeBetween(value, 1, 24);
			//Validators.stringContainsOnlyLatinLetters(value);
		  if(!(/^[a-zA-Z\d ]+$/.test(value))){
				throw Error('String should contain only latin letters, digits and blank spaces.');
			}
      if(value.length < 1 || value.length > 24){
        throw Error(`String must be between ${min} and ${max} characters long.`);
      }
			this._name = value;
		}
		get description(){
			return this._description;
		}
		set description(value){
			Validators.isString(value);
			this._description = value;
		}
		get version(){
			return this._version;
		}
		set version(value){
		  Validators.isNumber(value);
			Validators.numberMustBePositive(value);
			this._version = value;
		}
		get rating(){
			return this._rating;
		}
		set rating(value){
		  Validators.isNumber(value);
			Validators.numberMustBeBetween(value, 1, 10);
			this._rating = value;
		}
		release(input){
			if(typeof input === 'number'){
				Validators.invalidVersion(input, this.version);
				this.version = input;
			}
			else{
			  var version = input.version;
			  
			  Validators.inputIsUndefined(version);
			  Validators.isNumber(version);
			  Validators.numberMustBePositive(version);
		   
			  Validators.invalidVersion(version, this.version);
			  
			  this.version = version;
			  
			  var description = input.description;
			  Validators.isString(description);
			  this.description = description;
			  
			  var rating = input.rating;
			  Validators.isNumber(rating);
			  Validators.numberMustBeBetween(rating, 1, 10);
			  this.rating = rating;
			}
		}
	}
	
	class Store extends App{
		constructor(name, description, version, rating){
			super(name, description, version, rating);
			this.apps = [];
		}
		uploadApp(app){
			Validators.isAppInstance(app);
			var sameExistingApp = this.apps.find(a => a.name === app.name);
			if(sameExistingApp === undefined){
				this.apps.push(app);
			}
			else{
        Validators.invalidVersion(app.version, sameExistingApp.version);				
				sameExistingApp.release(app);
			}
			app.timeOfUpload = timeGenerator();
			return this;
		}
		takedownApp(name){
			var matchingApp = this.apps.find(a => a.name === name);
			if(matchingApp === undefined){
				throw Error('App not found');
			}
			this.apps.splice(this.apps.indexOf(matchingApp), 1);
		  return this;
		}
		search(pattern){
			var result = [];
			
			var matchingSubstr = pattern.toLowerCase();
			
			for(var app of this.apps){
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
			
      result = this.apps.sort(function(a, b){return a.timeOfUpload < b.timeOfUpload});
      			
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
			
      result = this.apps.sort(function(a, b){
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
			this.hostname = hostname;
			this.apps = apps;
		}
		get hostname(){
			return this._hostname;
		}
		set hostname(value){
			Validators.stringMustBeBetween(value, 1, 32);
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
				Validators.isAppInstance(app);
			}
			this._apps = value;
		}
		search(pattern){
		  var result = [];
			
			var matchingSubstr = pattern.toLowerCase();
			
		  for(var store of this.apps){
				  if(store.apps !== undefined){
						for(var app of store.apps){
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
					
		  for(var store of this.apps){
				  if(store.apps !== undefined){
						for(var app of store.apps){				
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
			
			var appAlreadyInstalled = this.apps.find(a => a.name === matchingApp.name);
			if(appAlreadyInstalled === undefined 
				 ||
				 appAlreadyInstalled.version < matchingApp.version
				){
				this.apps.push(matchingApp);
			}
		
			return this;
			
		}
		uninstall(name){
			var appExists = this.apps.find(a => a.name === name);
			if(appExists === undefined){
				throw Error('app not installed on device');
			}
			else{
			 this.apps.splice(this.apps.indexOf(appExists), 1);
			}
			return this;
		}
		listInstalled(){
			return this.apps.sort(function(a, b){return a.name > b.name});
		}
		update(){
			for(var app of this.apps){
				//this.install(app.name);
			}
			return this;
		}
	}
	
	var App1 = new App("app 1", "app1descr", 1, 2);
	
	console.log(App1);
	
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
