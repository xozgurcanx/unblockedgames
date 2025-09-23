var $global = typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this;
var console = $global.console || {log:function(){}};
var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
};
var HxOverrides = $hxClasses["HxOverrides"] = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js._Boot.HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = $hxClasses["Lambda"] = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
};
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,iterator: function() {
		return new _List.ListIterator(this.h);
	}
	,__class__: List
};
var _List = _List || {};
_List.ListIterator = $hxClasses["_List.ListIterator"] = function(head) {
	this.head = head;
	this.val = null;
};
_List.ListIterator.__name__ = ["_List","ListIterator"];
_List.ListIterator.prototype = {
	hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		this.val = this.head[0];
		this.head = this.head[1];
		return this.val;
	}
	,__class__: _List.ListIterator
};
Math.__name__ = ["Math"];
var Reflect = $hxClasses["Reflect"] = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js._Boot.HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = $hxClasses["Std"] = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = $hxClasses["StringTools"] = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { };
Type.__name__ = ["Type"];
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw new js._Boot.HaxeError("No such constructor " + constr);
	if(Reflect.isFunction(f)) {
		if(params == null) throw new js._Boot.HaxeError("Constructor " + constr + " need parameters");
		return Reflect.callMethod(e,f,params);
	}
	if(params != null && params.length != 0) throw new js._Boot.HaxeError("Constructor " + constr + " does not need parameters");
	return f;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js.Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var com = com || {};
if(!com.funtomic) com.funtomic = {};
com.funtomic.GameOpsStatus = $hxClasses["com.funtomic.GameOpsStatus"] = { __ename__ : ["com","funtomic","GameOpsStatus"], __constructs__ : ["UNINITIALIZED","INITIALIZING","INITIALIZED","INITIALIZE_FAILED","QUITTING"] };
com.funtomic.GameOpsStatus.UNINITIALIZED = ["UNINITIALIZED",0];
com.funtomic.GameOpsStatus.UNINITIALIZED.toString = $estr;
com.funtomic.GameOpsStatus.UNINITIALIZED.__enum__ = com.funtomic.GameOpsStatus;
com.funtomic.GameOpsStatus.INITIALIZING = ["INITIALIZING",1];
com.funtomic.GameOpsStatus.INITIALIZING.toString = $estr;
com.funtomic.GameOpsStatus.INITIALIZING.__enum__ = com.funtomic.GameOpsStatus;
com.funtomic.GameOpsStatus.INITIALIZED = ["INITIALIZED",2];
com.funtomic.GameOpsStatus.INITIALIZED.toString = $estr;
com.funtomic.GameOpsStatus.INITIALIZED.__enum__ = com.funtomic.GameOpsStatus;
com.funtomic.GameOpsStatus.INITIALIZE_FAILED = ["INITIALIZE_FAILED",3];
com.funtomic.GameOpsStatus.INITIALIZE_FAILED.toString = $estr;
com.funtomic.GameOpsStatus.INITIALIZE_FAILED.__enum__ = com.funtomic.GameOpsStatus;
com.funtomic.GameOpsStatus.QUITTING = ["QUITTING",4];
com.funtomic.GameOpsStatus.QUITTING.toString = $estr;
com.funtomic.GameOpsStatus.QUITTING.__enum__ = com.funtomic.GameOpsStatus;
com.funtomic.GameOps = $hxClasses["com.funtomic.GameOps"] = function() { };
com.funtomic.GameOps.__name__ = ["com","funtomic","GameOps"];
com.funtomic.GameOps.init = function(pDomain,pGameVersion,pDefaultConfig,pGameState,callback) {
	if(com.funtomic.GameOps.status != com.funtomic.GameOpsStatus.UNINITIALIZED) return;
	com.funtomic.GameOps.status = com.funtomic.GameOpsStatus.INITIALIZING;
	com.funtomic.GameOps.domain = pDomain;
	com.funtomic.GameOps.gameVersion = pGameVersion;
	com.funtomic.GameOpsStorage.init();
	com.funtomic.GameOps.readLocalStorage();
	com.funtomic.GameOps.readGameStateLocalStorage();
	com.funtomic.GameOps.url = window.location.href;
	com.funtomic.GameOps.startTimer("session");
	if(com.funtomic.GameOps.isInKiziWrapper()) {
		com.funtomic.GameOps.isNative = true;
		com.funtomic.GameOps.platform = com.funtomic.GameOps.getPlatform();
	} else {
		com.funtomic.GameOps.platform = "web";
		com.funtomic.GameOps.isNative = false;
	}
	com.funtomic.GameOps.hostType = com.funtomic.GameOps.getUserOS();
	if(com.funtomic.GameOps.isInKiziApp()) com.funtomic.GameOps.hostType += "_kizi_app"; else if(com.funtomic.GameOps.isNative) com.funtomic.GameOps.hostType += "_native_app"; else com.funtomic.GameOps.hostType += "_browser";
	com.funtomic.GameOps.sessionId = com.funtomic.GameOps.generateRandomString(20);
	if(com.funtomic.GameOps.localStorage.installDate == null) {
		com.funtomic.GameOps.localStorage.installDate = Math.round(new Date().getTime() / 1000);
		com.funtomic.GameOps.firstSession = true;
		com.funtomic.GameOps.reportEvent("first_run");
	}
	com.funtomic.GameOps.elapsedGameTime = com.funtomic.GameOps.storageGet("FuntomicGameOps-ElapsedGameTime",0);
	if(com.funtomic.GameOps.localStorage.elapsedGameTime != null) {
		com.funtomic.GameOps.elapsedGameTime = com.funtomic.GameOps.localStorage.elapsedGameTime;
		Reflect.deleteField(com.funtomic.GameOps.localStorage,"elapsedGameTime");
	}
	if(com.funtomic.GameOps.localStorage.originalVersion == null) com.funtomic.GameOps.localStorage.originalVersion = com.funtomic.GameOps.gameVersion;
	com.funtomic.GameOps.elapsedPlayTimeAtInit = com.funtomic.GameOps.elapsedGameTime;
	com.funtomic.GameOps.userID = com.funtomic.GameOps.localStorage.userID;
	var html5ApiUserId = com.funtomic.GameOps.KiziAPI_getUserId();
	if(html5ApiUserId != null) com.funtomic.GameOps.userID = html5ApiUserId;
	com.funtomic.GameOps.levelsWon = 0;
	if(com.funtomic.GameOps.localStorage.config == null || com.funtomic.GameOps.localStorage.configForVersion != null && com.funtomic.GameOps.localStorage.configForVersion != com.funtomic.GameOps.gameVersion) com.funtomic.GameOps.localStorage.config = pDefaultConfig;
	com.funtomic.GameOps.gameConfig = com.funtomic.GameOps.localStorage.config;
	if(com.funtomic.GameOps.localStorage.isSynced == null) com.funtomic.GameOps.localStorage.isSynced = false;
	if(com.funtomic.GameOps.localStorage.experimentId != null) com.funtomic.GameOps.experimentId = com.funtomic.GameOps.localStorage.experimentId;
	if(com.funtomic.GameOps.localStorage.alternativeId != null) com.funtomic.GameOps.alternativeId = com.funtomic.GameOps.localStorage.alternativeId;
	var lastSessionEndEvent = com.funtomic.GameOps.storageGet("FuntomicGameOps-SessionEndEvent",null);
	if(lastSessionEndEvent != null) {
		com.funtomic.GameOps.reportEvents([lastSessionEndEvent]);
		com.funtomic.GameOps.storageRemove("FuntomicGameOps-SessionEndEvent");
	}
	var prefix = null;
	if(Reflect.field(window.document,"hidden") != null) prefix = ""; else if(Reflect.field(window.document,"webkitHidden")) prefix = "webkit";
	var onVisibilityChanged = function(_) {
		com.funtomic.GameOps.isHidden = Reflect.field(window.document,prefix == ""?"hidden":prefix + "Hidden");
		if(com.funtomic.GameOps.isHidden) com.funtomic.GameOps.sessionEnd();
		com.funtomic.GameOps.pauseTimers(com.funtomic.GameOps.isHidden);
	};
	var onPageTransitionChange = function(event) {
		com.funtomic.GameOps.isHidden = event.type == "pagehide";
		if(com.funtomic.GameOps.isHidden) com.funtomic.GameOps.sessionEnd();
		com.funtomic.GameOps.pauseTimers(com.funtomic.GameOps.isHidden);
	};
	if(prefix != null) window.document.addEventListener(prefix + "visibilitychange",onVisibilityChanged,false); else {
		window.addEventListener("pageshow",onPageTransitionChange,false);
		window.addEventListener("pagehide",onPageTransitionChange,false);
	}
	var sessionEndTimer = new haxe.Timer(5000);
	sessionEndTimer.run = function() {
		com.funtomic.GameOps.sessionEnd();
	};
	com.funtomic.GameOps.reportEvent("session_start");
	com.funtomic.GameOps.gameStateGameOpsData.elapsed_game_time = com.funtomic.GameOps.elapsedGameTime;
	com.funtomic.GameOps.gameStateGameOpsData.install_date = com.funtomic.GameOps.localStorage.installDate;
	com.funtomic.GameOps.writeLocalStorage();
	com.funtomic.GameOps.writeGameStateLocalStorage();
	pGameState.game_ops_data = com.funtomic.GameOps.gameStateGameOpsData;
	com.funtomic.GameOps.loadGameConfig(pGameState,callback);
};
com.funtomic.GameOps.sendRequest = function(url,params,onSuccess,onStatus,onError,isPost,isAsync) {
	if(isAsync == null) isAsync = true;
	if(isPost == null) isPost = true;
	var request = new haxe.Http(null);
	request.url = url;
	if(params != null) {
		var _g = 0;
		var _g1 = Reflect.fields(params);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			request.setParameter(key,Reflect.field(params,key));
		}
	}
	if(onSuccess != null) request.onData = onSuccess;
	if(onStatus != null) request.onStatus = onStatus;
	if(onError != null) request.onError = onError;
	request.request(isPost);
};
com.funtomic.GameOps.loadGameConfig = function(gameState,callback) {
	com.funtomic.GameOpsLogger.verbose(["Fetching game config for: ",com.funtomic.GameOps.domain]);
	var url = com.funtomic.GameOps.apiURLPrefix + com.funtomic.GameOps.apiConfigLocation;
	var params = { domain : com.funtomic.GameOps.domain, game_state : JSON.stringify(gameState), game_ops_version : com.funtomic.GameOps.gameOpsVersion, game_version : com.funtomic.GameOps.gameVersion, platform_name : com.funtomic.GameOps.platform};
	if(com.funtomic.GameOps.userID != null) params.user_id = com.funtomic.GameOps.userID;
	if(com.funtomic.GameOps.experimentId != null) params.experiment_id = com.funtomic.GameOps.experimentId;
	if(com.funtomic.GameOps.alternativeId != null) params.alternative_id = com.funtomic.GameOps.alternativeId;
	if(com.funtomic.GameOps.localStorage.userEmail != null) params.user_email = com.funtomic.GameOps.localStorage.userEmail;
	if(com.funtomic.GameOps.localStorage.configMd5 != null && com.funtomic.GameOps.localStorage.config != null) params.config_md5 = com.funtomic.GameOps.localStorage.configMd5;
	com.funtomic.GameOps.sendRequest(url,params,function(responseString) {
		com.funtomic.GameOps.onConfigLoadSuccess(responseString);
		if(callback != null) callback(true);
		com.funtomic.GameOps.afterInit();
	},com.funtomic.GameOps.onConfigLoadReturned,function(msg) {
		com.funtomic.GameOps.IOErrorHandler(msg);
		com.funtomic.GameOps.status = com.funtomic.GameOpsStatus.INITIALIZE_FAILED;
		if(callback != null) callback(false);
		com.funtomic.GameOps.afterInit();
	},true,false);
};
com.funtomic.GameOps.onConfigLoadReturned = function(status) {
	switch(status) {
	case 500:
		com.funtomic.GameOps.onConfigLoadFailure();
		break;
	case 0:
		com.funtomic.GameOps.onConfigLoadTimeout();
		break;
	}
};
com.funtomic.GameOps.onConfigLoadTimeout = function() {
	com.funtomic.GameOpsLogger.error(["Timeout while fetching game config from server"]);
};
com.funtomic.GameOps.onConfigLoadFailure = function() {
	com.funtomic.GameOpsLogger.error(["Error loading config"]);
};
com.funtomic.GameOps.IOErrorHandler = function(msg) {
	com.funtomic.GameOpsLogger.error(["Error caught ",msg]);
};
com.funtomic.GameOps.onConfigLoadSuccess = function(resultString) {
	var result = JSON.parse(resultString);
	com.funtomic.GameOpsLogger.verbose(["Config successfuly loaded",resultString]);
	if(result != null) {
		if(result.user_id != null) {
			com.funtomic.GameOps.userID = result.user_id;
			com.funtomic.GameOps.localStorage.userID = result.user_id;
		}
		if(result.is_debug_mode) com.funtomic.GameOps.isDebugMode = result.is_debug_mode;
		if(result.install_date) com.funtomic.GameOps.localStorage.installDate = result.install_date;
		com.funtomic.GameOps.experimentId = result.experiment_id;
		com.funtomic.GameOps.localStorage.experimentId = com.funtomic.GameOps.experimentId;
		com.funtomic.GameOps.alternativeId = result.alternative_id;
		com.funtomic.GameOps.localStorage.alternativeId = com.funtomic.GameOps.alternativeId;
		if(result.config != null) com.funtomic.GameOps.localStorage.config = result.config;
		com.funtomic.GameOps.gameConfig = com.funtomic.GameOps.localStorage.config;
		com.funtomic.GameOps.localStorage.configMd5 = result.config_md5;
		com.funtomic.GameOps.localStorage.configForVersion = com.funtomic.GameOps.gameVersion;
		com.funtomic.GameOps.localStorage.googlePublicKey = result.google_public_key;
		com.funtomic.GameOps.localStorage.appstoreId = result.appstore_id;
		com.funtomic.GameOps.writeLocalStorage();
		com.funtomic.GameOps.status = com.funtomic.GameOpsStatus.INITIALIZED;
		com.funtomic.GameOps.reportUnsentEvents();
	}
};
com.funtomic.GameOps.afterInit = function() {
	if(com.funtomic.GameOps.alternativeId != null) com.funtomic.GameOps.KiziAPI_setAlternativeId();
	var HTML5API_params = { game_ops_version : com.funtomic.GameOps.gameOpsVersion, game_version : com.funtomic.GameOps.gameVersion, game_session_id : com.funtomic.GameOps.sessionId, game_user_id : com.funtomic.GameOps.userID};
	if(com.funtomic.GameOps.experimentId != null) HTML5API_params.game_experiment_id = com.funtomic.GameOps.experimentId;
	if(com.funtomic.GameOps.alternativeId != null) HTML5API_params.game_alternative_id = com.funtomic.GameOps.alternativeId;
	com.funtomic.GameOps.KiziAPI_reportCustomEvent("game_ops_data",HTML5API_params);
	com.funtomic.GameOpsLogger.debug(["Executing " + com.funtomic.GameOps.deferredReportEvents.length + " deferred event report calls"]);
	var _g = 0;
	var _g1 = com.funtomic.GameOps.deferredReportEvents;
	while(_g < _g1.length) {
		var repotEventFunc = _g1[_g];
		++_g;
		repotEventFunc();
	}
	com.funtomic.GameOps.deferredReportEvents = [];
	try {
		if(com.funtomic.GameOps.gameConfig.eval_on_after_init != null && com.funtomic.GameOps.gameConfig.eval_on_after_init != "") {
			window.evalInContext = function(js, context) { return function() { return eval(js); }.call(context); }
			var evalInContext = Reflect.field(window,"evalInContext");
			evalInContext(com.funtomic.GameOps.gameConfig.eval_on_after_init,com.funtomic.GameOps);
		}
	} catch( e ) {
		if (e instanceof js._Boot.HaxeError) e = e.val;
		com.funtomic.GameOps.reportEvent("error_eval",{ code : com.funtomic.GameOps.gameConfig.eval_on_after_init, message : Std.string(e)});
	}
	var _g2 = 0;
	var _g11 = com.funtomic.GameOps.onInitDoneFunctions;
	while(_g2 < _g11.length) {
		var func = _g11[_g2];
		++_g2;
		func();
	}
};
com.funtomic.GameOps.getConfig = function() {
	return com.funtomic.GameOps.gameConfig;
};
com.funtomic.GameOps.getEventsStaticParams = function(events) {
	var data = { domain : com.funtomic.GameOps.domain, uuid : com.funtomic.GameOps.userID, platform : com.funtomic.GameOps.platform, is_native : com.funtomic.GameOps.isNative, is_synced : com.funtomic.GameOps.localStorage.isSynced, install_date : com.funtomic.GameOps.localStorage.installDate, original_version : com.funtomic.GameOps.localStorage.originalVersion, partial_data : com.funtomic.GameOps.localStorage.partialData, is_in_kizi_app : com.funtomic.GameOps.isInKiziApp(), is_in_kizi_web : com.funtomic.GameOps.isInKiziWeb(), is_in_kizi_mobile_web : com.funtomic.GameOps.isInKiziMobileWeb(), host_type : com.funtomic.GameOps.hostType, events : events};
	try {
		var campaignData = Reflect.field(window,"jsinterface").getCampaignData();
		var res = JSON.parse(campaignData);
		var _g = 0;
		var _g1 = Reflect.fields(res);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			Reflect.setField(data,key,Reflect.field(res,key));
		}
	} catch( e ) {
		if (e instanceof js._Boot.HaxeError) e = e.val;
	}
	if(com.funtomic.GameOps.url != null) data.url = com.funtomic.GameOps.url;
	if(com.funtomic.GameOps.localStorage.isConverted != null) data.is_converted = com.funtomic.GameOps.localStorage.isConverted;
	if(com.funtomic.GameOps.mediaSource != null) data.media_source = com.funtomic.GameOps.mediaSource;
	if(com.funtomic.GameOps.campaignName != null) data.campaign_name = com.funtomic.GameOps.campaignName;
	return data;
};
com.funtomic.GameOps.reportEvents = function(events) {
	if(com.funtomic.GameOps.status != com.funtomic.GameOpsStatus.INITIALIZED) {
		com.funtomic.GameOps.queueEvents(events);
		return;
	}
	var url = com.funtomic.GameOps.apiURLPrefix + com.funtomic.GameOps.apiEventsLocation;
	var data = com.funtomic.GameOps.getEventsStaticParams(events);
	var params = { domain : com.funtomic.GameOps.domain, data : JSON.stringify(data)};
	com.funtomic.GameOpsLogger.verbose(["Posting event to:",url]);
	com.funtomic.GameOps.sendRequest(url,params,com.funtomic.GameOps.eventReportSucceeded,function(status) {
		com.funtomic.GameOps.onEventReportReturned(status,events);
	},com.funtomic.GameOps.IOErrorHandler);
	com.funtomic.GameOps.sessionEnd();
};
com.funtomic.GameOps.onEventReportReturned = function(status,events) {
	switch(status) {
	case 500:
		com.funtomic.GameOps.eventReportFailed();
		break;
	case 0:
		com.funtomic.GameOps.eventReportTimeout(events);
		break;
	}
};
com.funtomic.GameOps.eventReportTimeout = function(events) {
	com.funtomic.GameOpsLogger.error(["Report event timeout"]);
	com.funtomic.GameOps.queueEvents(events);
};
com.funtomic.GameOps.eventReportFailed = function() {
	com.funtomic.GameOpsLogger.error(["Report event failed"]);
	com.funtomic.GameOps.localStorage.unsentEvents = [];
	com.funtomic.GameOps.localStorage.partialData = true;
	com.funtomic.GameOps.writeLocalStorage();
};
com.funtomic.GameOps.eventReportSucceeded = function(data) {
	com.funtomic.GameOpsLogger.verbose(["Event Posted " + data]);
	com.funtomic.GameOps.reportUnsentEvents();
};
com.funtomic.GameOps.reportEvent = function(eventType,params) {
	if(com.funtomic.GameOps.isEventsTraceOnly) {
		haxe.Log.trace(eventType,{ fileName : "GameOps.hx", lineNumber : 626, className : "com.funtomic.GameOps", methodName : "reportEvent", customParams : [params]});
		return;
	}
	var _g = com.funtomic.GameOps.status;
	switch(_g[1]) {
	case 1:
		com.funtomic.GameOps.deferredReportEvents.push(function() {
			com.funtomic.GameOps.reportEvent(eventType,params);
		});
		break;
	default:
		var event = com.funtomic.GameOps.prepareEventObject(eventType,params);
		com.funtomic.GameOps.reportEvents([event]);
	}
};
com.funtomic.GameOps.prepareEventObject = function(eventType,params) {
	var timestamp = Std.string(new Date().getTime() / 1000);
	var event = { event_type : eventType, timestamp : timestamp};
	if(com.funtomic.GameOps.experimentId != null) event.experiment_id = com.funtomic.GameOps.experimentId;
	if(com.funtomic.GameOps.alternativeId != null) event.alternative_id = com.funtomic.GameOps.alternativeId;
	var elapsedSessionTime = com.funtomic.GameOps.sampleTimer("session");
	event.elapsed_session_time = Math.round(elapsedSessionTime / 1000);
	event.elapsed_play_time = Math.round(com.funtomic.GameOps.elapsedPlayTimeAtInit + elapsedSessionTime / 1000);
	event.session_id = com.funtomic.GameOps.sessionId;
	event.game_ops_version = com.funtomic.GameOps.gameOpsVersion;
	event.game_version = com.funtomic.GameOps.gameVersion;
	if(com.funtomic.GameOps.firstSession) event.first_session = true;
	if(com.funtomic.GameOps.fbId != null) event.fb_id = com.funtomic.GameOps.fbId;
	event = com.funtomic.GameOps.extendObject(event,params);
	if(com.funtomic.GameOps.additionalEventsParams != null) event = com.funtomic.GameOps.extendObject(event,com.funtomic.GameOps.additionalEventsParams);
	return event;
};
com.funtomic.GameOps.queueEvents = function(events) {
	com.funtomic.GameOpsLogger.verbose(["Queuing events:" + JSON.stringify(events)]);
	if(com.funtomic.GameOps.localStorage.unsentEvents == null) com.funtomic.GameOps.localStorage.unsentEvents = [];
	var _g = 0;
	while(_g < events.length) {
		var event = events[_g];
		++_g;
		com.funtomic.GameOps.localStorage.unsentEvents.push(event);
	}
	if(com.funtomic.GameOps.localStorage.unsentEvents.length > com.funtomic.GameOps.MAX_SAVED_UNSENT_EVENTS) {
		com.funtomic.GameOps.localStorage.unsentEvents = [];
		com.funtomic.GameOps.localStorage.partialData = true;
	}
	com.funtomic.GameOps.writeLocalStorage();
	com.funtomic.GameOpsLogger.verbose(["There are now " + Std.string(com.funtomic.GameOps.localStorage.unsentEvents.length) + " unsent events."]);
};
com.funtomic.GameOps.reportUnsentEvents = function() {
	if(com.funtomic.GameOps.localStorage.unsentEvents != null && com.funtomic.GameOps.localStorage.unsentEvents.length > 0) {
		com.funtomic.GameOpsLogger.verbose(["reporting unsent events",com.funtomic.GameOps.localStorage.unsentEvents.length]);
		com.funtomic.GameOps.reportEvents(com.funtomic.GameOps.localStorage.unsentEvents);
		com.funtomic.GameOps.localStorage.unsentEvents = [];
		com.funtomic.GameOps.writeLocalStorage();
	}
};
com.funtomic.GameOps.levelStarted = function(levelNumber,extraParams) {
	com.funtomic.GameOps.startTimer("level_" + levelNumber);
	com.funtomic.GameOps.levelsNumbers.push(levelNumber);
	if(com.funtomic.GameOps.gameStateGameOpsData.progress == null) com.funtomic.GameOps.gameStateGameOpsData.progress = { };
	if(com.funtomic.GameOps.gameStateGameOpsData.progress.top_level == null || com.funtomic.GameOps.gameStateGameOpsData.progress.top_level < levelNumber) {
		com.funtomic.GameOps.gameStateGameOpsData.progress.top_level = levelNumber;
		com.funtomic.GameOps.writeGameStateLocalStorage();
	}
	var data = { level : levelNumber};
	if(extraParams != null) data = com.funtomic.GameOps.extendObject(extraParams,data);
	com.funtomic.GameOps.reportEvent("level_started",data);
	com.funtomic.GameOps.KiziAPI_levelStarted([levelNumber,extraParams]);
};
com.funtomic.GameOps.levelEnded = function(levelNumber,won,extraParams) {
	var levelDuration = com.funtomic.GameOps.stopTimer("level_" + levelNumber);
	if(levelDuration == -1) {
		com.funtomic.GameOpsLogger.error(["levelEnded was called without a matching startLevel!"]);
		return;
	}
	if(won) com.funtomic.GameOps.levelsWon++;
	var data = { level : levelNumber, level_duration : Math.round(levelDuration / 1000), won : won == null?"null":"" + won};
	if(com.funtomic.GameOps.movesDuration.length > 0) {
		data.moves_duration = com.funtomic.GameOps.movesDuration.join(",");
		com.funtomic.GameOps.movesDuration = [];
	}
	if(extraParams != null) data = com.funtomic.GameOps.extendObject(extraParams,data);
	com.funtomic.GameOps.reportEvent("level_ended",data);
	if(won && levelNumber == com.funtomic.GameOps.lastLevelNumber) com.funtomic.GameOps.reportEvent("game_completion");
	com.funtomic.GameOps.KiziAPI_levelEnded([levelNumber,won,extraParams]);
};
com.funtomic.GameOps.sessionEnd = function(sendInNextPlay,extraParams) {
	if(sendInNextPlay == null) sendInNextPlay = true;
	var sessionDuration = com.funtomic.GameOps.sampleTimer("session");
	if(sessionDuration == -1) {
		com.funtomic.GameOpsLogger.error(["sessionEnd was called without a matching sessionStart!"]);
		return;
	}
	var lnu = [];
	var _g = 0;
	var _g1 = com.funtomic.GameOps.levelsNumbers;
	while(_g < _g1.length) {
		var lvlNum = _g1[_g];
		++_g;
		if(HxOverrides.indexOf(lnu,lvlNum,0) == -1) lnu.push(lvlNum);
	}
	var data = { session_duration : Math.round(sessionDuration / 1000), levels_numbers : lnu.toString(), won_percent : 0, levels_count : com.funtomic.GameOps.levelsNumbers.length, levels_won : com.funtomic.GameOps.levelsWon, sent_by : "application"};
	if(extraParams != null) data = com.funtomic.GameOps.extendObject(extraParams,data);
	if(data.levels_count > 0) data.won_percent = com.funtomic.GameOps.levelsWon / com.funtomic.GameOps.levelsNumbers.length * 100;
	com.funtomic.GameOps.updateTotalElapsedTime(sessionDuration / 1000);
	var event = com.funtomic.GameOps.prepareEventObject("session_end",data);
	if(sendInNextPlay) {
		com.funtomic.GameOpsLogger.verbose(["writing session end event to local storage"]);
		com.funtomic.GameOps.storageSet("FuntomicGameOps-SessionEndEvent",event);
	} else com.funtomic.GameOps.reportEvents([event]);
};
com.funtomic.GameOps.setLastLevelNumber = function(pLastLevelNumber) {
	com.funtomic.GameOps.lastLevelNumber = pLastLevelNumber;
};
com.funtomic.GameOps.updateTotalElapsedTime = function(sessionDuration) {
	com.funtomic.GameOps.storageSet("FuntomicGameOps-ElapsedGameTime",com.funtomic.GameOps.elapsedPlayTimeAtInit + sessionDuration);
};
com.funtomic.GameOps.startTimer = function(key) {
	com.funtomic.GameOpsLogger.verbose(["Timer '" + key + "' started."]);
	Reflect.setField(com.funtomic.GameOps.timers,key,[com.funtomic.GameOps.getTimestamp(),0.0]);
};
com.funtomic.GameOps.sampleTimer = function(key,remove) {
	if(remove == null) remove = false;
	if(Reflect.field(com.funtomic.GameOps.timers,key) == null) return -1;
	var elapsed = Reflect.field(com.funtomic.GameOps.timers,key)[1];
	if(Reflect.field(com.funtomic.GameOps.timers,key)[0] != 0) elapsed += com.funtomic.GameOps.getTimestamp() - Reflect.field(com.funtomic.GameOps.timers,key)[0];
	if(remove) Reflect.deleteField(com.funtomic.GameOps.timers,key);
	com.funtomic.GameOpsLogger.verbose(["Timer '" + key + "' sampled. Current elapsed time is " + elapsed]);
	return elapsed;
};
com.funtomic.GameOps.stopTimer = function(key) {
	com.funtomic.GameOpsLogger.verbose(["Timer '" + key + "' stopped"]);
	return com.funtomic.GameOps.sampleTimer(key,true);
};
com.funtomic.GameOps.pauseTimers = function(state) {
	if(state == null) state = true;
	var _g = 0;
	var _g1 = Reflect.fields(com.funtomic.GameOps.timers);
	while(_g < _g1.length) {
		var key = _g1[_g];
		++_g;
		if(state) {
			if(Reflect.field(com.funtomic.GameOps.timers,key)[0] != 0) {
				Reflect.field(com.funtomic.GameOps.timers,key)[1] += com.funtomic.GameOps.getTimestamp() - Reflect.field(com.funtomic.GameOps.timers,key)[0];
				Reflect.field(com.funtomic.GameOps.timers,key)[0] = 0;
				com.funtomic.GameOpsLogger.verbose(["Timer '" + key + "' paused at " + Reflect.field(com.funtomic.GameOps.timers,key)[1] + " ms"]);
			} else com.funtomic.GameOpsLogger.verbose(["NOTE: Timer '" + key + "' attempt to pause at " + Reflect.field(com.funtomic.GameOps.timers,key)[1] + " **but was already paused**"]);
		} else if(Reflect.field(com.funtomic.GameOps.timers,key)[0] == 0) {
			Reflect.field(com.funtomic.GameOps.timers,key)[0] = com.funtomic.GameOps.getTimestamp();
			com.funtomic.GameOpsLogger.verbose(["Timer '" + key + "' unpaused at " + Reflect.field(com.funtomic.GameOps.timers,key)[1] + " ms"]);
		} else com.funtomic.GameOpsLogger.verbose(["NOTE: Timer '" + key + "' attempt to unpause at " + Reflect.field(com.funtomic.GameOps.timers,key)[1] + " **but was already unpaused**"]);
	}
};
com.funtomic.GameOps.saveGameState = function(gameState,key,callback,usesNum,expiryDays) {
	if(expiryDays == null) expiryDays = 7;
	if(usesNum == null) usesNum = 1;
	if(com.funtomic.GameOps.status != com.funtomic.GameOpsStatus.INITIALIZED) return;
	var url = com.funtomic.GameOps.apiURLPrefix + com.funtomic.GameOps.apiTokensLocation;
	com.funtomic.GameOpsLogger.verbose(["Getting a token:",url]);
	var params = { domain : com.funtomic.GameOps.domain, game_state : JSON.stringify(gameState), user_id : Std.string(com.funtomic.GameOps.userID), expiry_days : expiryDays == null?"null":"" + expiryDays};
	if(key != null) params.key = key; else if(com.funtomic.GameOps.fbId != null) params.key = com.funtomic.GameOps.fbId; else if(usesNum == null) params.uses_num = "null"; else params.uses_num = "" + usesNum;
	com.funtomic.GameOps.sendRequest(url,params,function(resultString) {
		var result = JSON.parse(resultString);
		if(result != null) {
			if(result.error_msg != null) com.funtomic.GameOpsLogger.error(["Error caught:",result.error_msg]); else {
				com.funtomic.GameOpsLogger.verbose(["Saved game state under key:",result.token]);
				if(callback != null) callback(result.token);
			}
		}
	},null,com.funtomic.GameOps.IOErrorHandler);
};
com.funtomic.GameOps.loadGameState = function(key,callback) {
	if(com.funtomic.GameOps.status != com.funtomic.GameOpsStatus.INITIALIZED) {
		if(callback != null) callback(false,null);
		return;
	}
	if(key == null) {
		if(com.funtomic.GameOps.fbId == null) {
			com.funtomic.GameOpsLogger.error(["Calling loadGameState() without a key is only possible after calling successfully logging in to FB via FBLogin()"]);
			if(callback != null) callback(false,null);
			return;
		}
		key = com.funtomic.GameOps.fbId;
	}
	var url = com.funtomic.GameOps.apiURLPrefix + com.funtomic.GameOps.apiTokensLocation + key;
	com.funtomic.GameOpsLogger.verbose(["Fetching game state for key:",key]);
	com.funtomic.GameOps.sendRequest(url + "?domain=" + com.funtomic.GameOps.domain,null,function(resultString) {
		var result = JSON.parse(resultString);
		if(result != null && result.game_state != null) {
			com.funtomic.GameOpsLogger.verbose(["Fetched game state:",result.game_state]);
			com.funtomic.GameOps.localStorage.isSynced = true;
			com.funtomic.GameOps.writeLocalStorage();
			com.funtomic.GameOps.reportEvent("load_game_state",{ previous_uuid : result.user_id});
			if(callback != null) callback(true,JSON.parse(result.game_state));
		} else if(callback != null) callback(false,null);
	},null,function(msg) {
		com.funtomic.GameOps.IOErrorHandler(msg);
		callback(false,null);
	},false);
};
com.funtomic.GameOps.getTimestamp = function() {
	return new Date().getTime();
};
com.funtomic.GameOps.getGooglePublicKey = function() {
	return com.funtomic.GameOps.localStorage.googlePublicKey;
};
com.funtomic.GameOps.extendObject = function(obj1,obj2) {
	var _g = 0;
	var _g1 = Reflect.fields(obj2);
	while(_g < _g1.length) {
		var k = _g1[_g];
		++_g;
		var value = Reflect.field(obj2,k);
		var key;
		if(k == null) key = "null"; else key = "" + k;
		obj1[key] = value;
	}
	return obj1;
};
com.funtomic.GameOps.generateRandomString = function(strlen) {
	var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var num_chars = chars.length - 1;
	var randomChar = "";
	var _g = 0;
	while(_g < strlen) {
		var i = _g++;
		randomChar += chars.charAt(Math.floor(Math.random() * num_chars));
	}
	return randomChar;
};
com.funtomic.GameOps.storageSet = function(key,value) {
	return com.funtomic.GameOpsStorage.set(com.funtomic.GameOps.domain + key,value);
};
com.funtomic.GameOps.storageGet = function(key,defaultValue) {
	return com.funtomic.GameOpsStorage.get(com.funtomic.GameOps.domain + key,defaultValue);
};
com.funtomic.GameOps.storageRemove = function(key) {
	com.funtomic.GameOpsStorage.remove(com.funtomic.GameOps.domain + key);
};
com.funtomic.GameOps.setAdditionalEventsParam = function(key,value) {
	if(com.funtomic.GameOps.additionalEventsParams == null) com.funtomic.GameOps.additionalEventsParams = { };
	com.funtomic.GameOps.additionalEventsParams[key] = value;
};
com.funtomic.GameOps.removeAdditionalEventsParam = function(key) {
	if(com.funtomic.GameOps.additionalEventsParams != null) Reflect.deleteField(com.funtomic.GameOps.additionalEventsParams,key);
};
com.funtomic.GameOps.writeLocalStorage = function() {
	com.funtomic.GameOps.storageSet("FuntomicGameOps",com.funtomic.GameOps.localStorage);
};
com.funtomic.GameOps.writeGameStateLocalStorage = function() {
	com.funtomic.GameOps.storageSet("FuntomicGameOps-GameState",com.funtomic.GameOps.gameStateGameOpsData);
};
com.funtomic.GameOps.readLocalStorage = function() {
	com.funtomic.GameOps.localStorage = com.funtomic.GameOps.storageGet("FuntomicGameOps",{ });
};
com.funtomic.GameOps.readGameStateLocalStorage = function() {
	com.funtomic.GameOps.gameStateGameOpsData = com.funtomic.GameOps.storageGet("FuntomicGameOps-GameState",{ });
};
com.funtomic.GameOps.setFlag = function(name) {
	if(Reflect.field(com.funtomic.GameOps.flags,name) == true) {
		com.funtomic.GameOpsLogger.debug([name + " is already running."]);
		return false;
	} else {
		com.funtomic.GameOps.flags[name] = true;
		return true;
	}
};
com.funtomic.GameOps.unsetFlag = function(name) {
	Reflect.deleteField(com.funtomic.GameOps.flags,name);
};
com.funtomic.GameOps.initGOPFuntomicAds = function() {
};
com.funtomic.GameOps.requestCrossPromotionAd = function() {
};
com.funtomic.GameOps.displayCrossPromotionAd = function(placement) {
	if(placement == null) placement = "";
};
com.funtomic.GameOps.initGOPDevice = function() {
};
com.funtomic.GameOps.setAdvertisingIdVariable = function() {
};
com.funtomic.GameOps.callKIZIAPIFunction = function(functionName,params) {
	var HTML5API = Reflect.field(window,"HTML5API");
	if(HTML5API == null) return null;
	var fn = Reflect.field(HTML5API,functionName);
	if(fn == null) return null;
	var returned;
	if((params instanceof Array) && params.__enum__ == null) returned = fn.apply(HTML5API,params); else returned = fn.apply(HTML5API,[params]);
	com.funtomic.GameOps.reportEvent("html5api_called",{ function_name : functionName, function_returned : returned, params : JSON.stringify(params)});
	return returned;
};
com.funtomic.GameOps.getPlatform = function() {
	try {
		var platform_raw = Reflect.field(window,"jsinterface").getPlatform().toLowerCase();
		if(platform_raw == "ios") return "iOS";
		if(platform_raw == "android") return "Android";
		return platform_raw;
	} catch( e ) {
		if (e instanceof js._Boot.HaxeError) e = e.val;
		return "other";
	}
};
com.funtomic.GameOps.isInKiziWrapper = function() {
	try {
		return Reflect.field(window,"jsinterface").getPackageName() != "com.funtomic.Kizi";
	} catch( e ) {
		if (e instanceof js._Boot.HaxeError) e = e.val;
		return false;
	}
};
com.funtomic.GameOps.isInKiziApp = function() {
	try {
		return Reflect.field(window,"jsinterface").getPackageName() == "com.funtomic.Kizi";
	} catch( e ) {
		if (e instanceof js._Boot.HaxeError) e = e.val;
		return false;
	}
};
com.funtomic.GameOps.isInKiziMobileWeb = function() {
	try {
		return window.parent.location.host == "m.kizi.com";
	} catch( e ) {
		if (e instanceof js._Boot.HaxeError) e = e.val;
		return false;
	}
};
com.funtomic.GameOps.isInKiziWeb = function() {
	try {
		return window.parent.location.host == "kizi.com";
	} catch( e ) {
		if (e instanceof js._Boot.HaxeError) e = e.val;
		return false;
	}
};
com.funtomic.GameOps.getUserOS = function() {
	if(com.funtomic.GameOps.getPlatform() != "other") return com.funtomic.GameOps.getPlatform().toLowerCase(); else if(new EReg("(Android)","i").match(window.navigator.userAgent)) return "android"; else if(new EReg("(iPad|iPhone|iPod)","i").match(window.navigator.userAgent)) return "ios"; else return "other";
};
com.funtomic.GameOps.KiziAPI_levelStarted = function(params) {
	com.funtomic.GameOps.callKIZIAPIFunction("levelStarted",params);
};
com.funtomic.GameOps.KiziAPI_levelEnded = function(params) {
	com.funtomic.GameOps.callKIZIAPIFunction("levelEnded",params);
};
com.funtomic.GameOps.KiziAPI_preloaderStarted = function(params) {
	com.funtomic.GameOps.callKIZIAPIFunction("preloaderStarted",params);
};
com.funtomic.GameOps.KiziAPI_preloaderEnded = function(params) {
	com.funtomic.GameOps.callKIZIAPIFunction("preloaderEnded",params);
};
com.funtomic.GameOps.KiziAPI_showStartButton = function() {
	return com.funtomic.GameOps.callKIZIAPIFunction("showStartButton");
};
com.funtomic.GameOps.KiziAPI_isAdPlaying = function() {
	return com.funtomic.GameOps.callKIZIAPIFunction("isAdPlaying");
};
com.funtomic.GameOps.KiziAPI_onAdStart = function(callback) {
	com.funtomic.GameOps.callKIZIAPIFunction("onAdStart",callback);
};
com.funtomic.GameOps.KiziAPI_onAdComplete = function(callback) {
	com.funtomic.GameOps.callKIZIAPIFunction("onAdComplete",callback);
};
com.funtomic.GameOps.KiziAPI_isMidrollPending = function() {
	return com.funtomic.GameOps.callKIZIAPIFunction("isMidrollPending");
};
com.funtomic.GameOps.KiziAPI_displayMidroll = function() {
	return com.funtomic.GameOps.callKIZIAPIFunction("displayMidroll");
};
com.funtomic.GameOps.KiziAPI_setWidgetState = function(params) {
	com.funtomic.GameOps.callKIZIAPIFunction("setWidgetState",params);
};
com.funtomic.GameOps.KiziAPI_sendLocalNotification = function(delaySconds,iconUrl,title,text,bigContentTitle,bigContentText,gameExtras) {
	return com.funtomic.GameOps.callKIZIAPIFunction("sendLocalNotification",[delaySconds,iconUrl,title,text,bigContentTitle,bigContentText,gameExtras]);
};
com.funtomic.GameOps.KiziAPI_cancelLocalNotification = function(id) {
	com.funtomic.GameOps.callKIZIAPIFunction("cancelLocalNotification",id);
};
com.funtomic.GameOps.KiziAPI_isIncentivizedVideoAvailable = function() {
	return com.funtomic.GameOps.callKIZIAPIFunction("isIncentivizedVideoAvailable");
};
com.funtomic.GameOps.KiziAPI_showIncentivizedVideo = function(callback) {
	com.funtomic.GameOps.callKIZIAPIFunction("showIncentivizedVideo",function(isFullyWatched) {
		com.funtomic.GameOps.reportEvent("HTML5API_IncentivizedVideoWatched",{ is_fully_watched : isFullyWatched});
		callback(isFullyWatched);
	});
};
com.funtomic.GameOps.KiziAPI_reportCustomEvent = function(eventType,params) {
	if(params == null) params = { };
	params.custom_event_name = eventType;
	com.funtomic.GameOps.callKIZIAPIFunction("reportCustomEvent",params);
};
com.funtomic.GameOps.KiziAPI_getUserId = function() {
	return com.funtomic.GameOps.callKIZIAPIFunction("getUserId");
};
com.funtomic.GameOps.KiziAPI_setAlternativeId = function() {
	com.funtomic.GameOps.callKIZIAPIFunction("setAlternativeId",com.funtomic.GameOps.alternativeId);
};
com.funtomic.GameOpsIAP = $hxClasses["com.funtomic.GameOpsIAP"] = function() { };
com.funtomic.GameOpsIAP.__name__ = ["com","funtomic","GameOpsIAP"];
com.funtomic.GameOpsIAP.mytrace = function(obj) {
	console.log(obj);
};
com.funtomic.GameOpsIAP.init = function(debug,onSuccess,onFail) {
	if(debug == null) debug = false;
	if(com.funtomic.GameOps.status == com.funtomic.GameOpsStatus.UNINITIALIZED || com.funtomic.GameOps.status == com.funtomic.GameOpsStatus.INITIALIZING) {
		com.funtomic.GameOpsIAP.mytrace("deferring GameOpsIAP init to GameOps afterInit");
		com.funtomic.GameOps.onInitDoneFunctions.push(function() {
			com.funtomic.GameOpsIAP.init(debug,onSuccess,onFail);
		});
		return;
	}
	if(com.funtomic.GameOps.status == com.funtomic.GameOpsStatus.INITIALIZE_FAILED) {
		if(onFail != null) onFail("Error: Can init GameOpsIAP only when GameOps init succeed");
		return;
	}
	var getGooglePublicKey = com.funtomic.GameOps.getGooglePublicKey();
	if(getGooglePublicKey == null || getGooglePublicKey == "") {
		if(onFail != null) onFail("Error: Google Public Key dosn't exists. Please make sure Google Public Key exists on Tools dashboard");
		return;
	}
	com.funtomic.GameOpsIAP.mInit(getGooglePublicKey,debug,onSuccess,onFail);
};
com.funtomic.GameOpsIAP.mInit = function(googlePublicKey,debug,onSuccess,onFail) {
	if(debug == null) debug = false;
	if(Reflect.field(window,"jsinterface") != null) com.funtomic.GameOpsIAP.jsInterface = Reflect.field(window,"jsinterface");
	var onSuccessSetState = function(msg) {
		com.funtomic.GameOpsIAP.status = com.funtomic.GameOpsStatus.INITIALIZED;
		if(onSuccess != null) onSuccess(msg);
	};
	var onFailSetState = function(msg1) {
		if(msg1 == "IabResult: Error: iabHelper instance already initialized (response: 0:OK)") onSuccessSetState("Warning: iabHelper instance already initialized (response: 0:OK)"); else {
			com.funtomic.GameOpsIAP.status = com.funtomic.GameOpsStatus.UNINITIALIZED;
			if(onFail != null) onFail(msg1);
		}
	};
	com.funtomic.GameOpsIAP.status = com.funtomic.GameOpsStatus.INITIALIZING;
	com.funtomic.GameOpsIAP.callJsInterfaceFunc("GOPInAppPurchaseInit",[googlePublicKey,debug],onSuccessSetState,onFailSetState);
};
com.funtomic.GameOpsIAP.requestProductsInfo = function(productIds,onSuccess,onFail) {
	if(!com.funtomic.GameOpsIAP.verifyInitialized(onFail)) return;
	var onSuccessSaveProductsInfo = function(inventory) {
		com.funtomic.GameOps.extendObject(com.funtomic.GameOpsIAP.innerProductsInfo,inventory.details);
		if(onSuccess != null) onSuccess(inventory);
	};
	com.funtomic.GameOpsIAP.callJsInterfaceFunc("GOPInAppPurchaseRequestProductsInfo",[productIds],onSuccessSaveProductsInfo,onFail);
};
com.funtomic.GameOpsIAP.restorePurchases = function(onSuccess,onFail) {
	if(!com.funtomic.GameOpsIAP.verifyInitialized(onFail)) return;
	com.funtomic.GameOpsIAP.callJsInterfaceFunc("GOPInAppPurchaseRestorePurchases",[],onSuccess,onFail);
};
com.funtomic.GameOpsIAP.purchaseProduct = function(productId,onSuccess,onFail) {
	if(!com.funtomic.GameOpsIAP.verifyInitialized(onFail)) return;
	if(!Object.prototype.hasOwnProperty.call(com.funtomic.GameOpsIAP.innerProductsInfo,productId)) {
		if(onFail != null) onFail("Error: Can't purchase product without receiving his info first");
		return;
	}
	var onSuccessWithEvent = function(purchase) {
		com.funtomic.GameOpsIAP.reportEventWithPurchaseData("IAP",purchase);
		if(onSuccess != null) onSuccess(purchase);
	};
	com.funtomic.GameOpsIAP.callJsInterfaceFunc("GOPInAppPurchasePurchaseProduct",[productId],onSuccessWithEvent,onFail);
};
com.funtomic.GameOpsIAP.consumePurchase = function(productId,onSuccess,onFail) {
	if(!com.funtomic.GameOpsIAP.verifyInitialized(onFail)) return;
	var onSuccessWithEvent = function(purchase) {
		com.funtomic.GameOpsIAP.reportEventWithPurchaseData("IAP_consume",purchase);
		if(onSuccess != null) onSuccess(purchase);
	};
	com.funtomic.GameOpsIAP.callJsInterfaceFunc("GOPInAppPurchaseConsumePurchase",[productId],onSuccessWithEvent,onFail);
};
com.funtomic.GameOpsIAP.callJsInterfaceFunc = function(funcName,args,onSuccess,onFail) {
	if(Reflect.field(com.funtomic.GameOpsIAP.jsInterface,funcName) == null) {
		if(onFail != null) onFail("Error: jsIntefrace is not supported on this platform. (trying to call jsInterface." + funcName + ")");
		return;
	}
	var successCallbackName = com.funtomic.GameOpsIAP.getCallbackNameNumbered(funcName + "OnSuccessCallback");
	var failCallbackName = com.funtomic.GameOpsIAP.getCallbackNameNumbered(funcName + "OnFailCallback");
	var onSuccessCallback = function(response) {
		Reflect.deleteField(window,successCallbackName);
		Reflect.deleteField(window,failCallbackName);
		if(onSuccess != null) onSuccess(response);
	};
	var onFailCallback = function(response1) {
		Reflect.deleteField(window,successCallbackName);
		Reflect.deleteField(window,failCallbackName);
		if(onFail != null) onFail(response1);
	};
	Reflect.setField(window,successCallbackName,onSuccessCallback);
	Reflect.setField(window,failCallbackName,onFailCallback);
	args.push(successCallbackName);
	args.push(failCallbackName);
	Reflect.callMethod(com.funtomic.GameOpsIAP.jsInterface,Reflect.field(com.funtomic.GameOpsIAP.jsInterface,funcName),args);
};
com.funtomic.GameOpsIAP.getCallbackNameNumbered = function(callbackName) {
	var result = callbackName + "_" + com.funtomic.GameOpsIAP.callbacksCounter;
	com.funtomic.GameOpsIAP.callbacksCounter += 1;
	return result;
};
com.funtomic.GameOpsIAP.reportEventWithPurchaseData = function(eventType,purchase) {
	var product = Reflect.field(com.funtomic.GameOpsIAP.innerProductsInfo,purchase.productId);
	if(product == null) product = { };
	var data = { item_id : product.productId, item_name : product.title, price : product.priceNumber, currency : product.priceCurrencyCode};
	var authData = { };
	if(com.funtomic.GameOps.getPlatform() == "Android") authData = { market : "gplay", receipt : purchase.receipt.signedData, signature : purchase.receipt.signature}; else if(com.funtomic.GameOps.getPlatform() == "iOS") authData = { market : "appstore", receipt : purchase.receipt.signedData};
	data.auth_data = authData;
	com.funtomic.GameOps.reportEvent(eventType,data);
};
com.funtomic.GameOpsIAP.verifyInitialized = function(onFail) {
	var _g = com.funtomic.GameOpsIAP.status;
	switch(_g[1]) {
	case 2:
		return true;
	case 0:
		if(onFail != null) onFail("Error: GameOpsIAP is not initialized");
		return false;
	case 1:
		if(onFail != null) onFail("Error: GameOpsIAP is initializing");
		return false;
	default:
		return false;
	}
};
com.funtomic.GameOpsLogger = $hxClasses["com.funtomic.GameOpsLogger"] = function() { };
com.funtomic.GameOpsLogger.__name__ = ["com","funtomic","GameOpsLogger"];
com.funtomic.GameOpsLogger.verbose = function(params) {
	com.funtomic.GameOpsLogger.log(2,params.join(" "));
};
com.funtomic.GameOpsLogger.debug = function(params) {
	com.funtomic.GameOpsLogger.log(1,params.join(" "));
};
com.funtomic.GameOpsLogger.error = function(params) {
	haxe.Log.trace("------------------------------------------------------------",{ fileName : "GameOpsLogger.hx", lineNumber : 18, className : "com.funtomic.GameOpsLogger", methodName : "error"});
	com.funtomic.GameOpsLogger.log(0,"ERROR - " + params.join(" "));
	haxe.Log.trace("------------------------------------------------------------",{ fileName : "GameOpsLogger.hx", lineNumber : 20, className : "com.funtomic.GameOpsLogger", methodName : "error"});
};
com.funtomic.GameOpsLogger.log = function(logLevel,message) {
	if(logLevel <= com.funtomic.GameOpsLogger.logLevel) {
		var now = new Date();
		var datetimeString = now.getDay() + "." + now.getMonth() + "." + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
		haxe.Log.trace(datetimeString + " - Funtomic Tools Log: " + message,{ fileName : "GameOpsLogger.hx", lineNumber : 30, className : "com.funtomic.GameOpsLogger", methodName : "log"});
	}
};
com.funtomic.GameOpsStorage = $hxClasses["com.funtomic.GameOpsStorage"] = function() { };
com.funtomic.GameOpsStorage.__name__ = ["com","funtomic","GameOpsStorage"];
com.funtomic.GameOpsStorage.init = function() {
	if(Type.resolveClass("flambe.System") != null) com.funtomic.GameOpsStorage._prefix = "flambe:";
	com.funtomic.GameOpsStorage._storage = window.localStorage;
	com.funtomic.GameOpsStorage._isInitialized = true;
};
com.funtomic.GameOpsStorage.validateInitialized = function() {
	if(!com.funtomic.GameOpsStorage._isInitialized) throw new js._Boot.HaxeError("GameOpsStorage Is Not Initialized!");
};
com.funtomic.GameOpsStorage.reportErrorEvent = function(extraParams) {
	if(com.funtomic.GameOpsStorage._isErrorEventsSent > 3) return;
	com.funtomic.GameOpsStorage._isErrorEventsSent += 1;
	com.funtomic.GameOps.reportEvent("local_storage_error",extraParams);
};
com.funtomic.GameOpsStorage.get_supported = function() {
	return true;
};
com.funtomic.GameOpsStorage.set = function(key,value) {
	com.funtomic.GameOpsStorage.validateInitialized();
	var encoded;
	try {
		var serializer = new haxe.Serializer();
		serializer.useCache = true;
		serializer.useEnumIndex = false;
		serializer.serialize(value);
		encoded = serializer.toString();
	} catch( error ) {
		if (error instanceof js._Boot.HaxeError) error = error.val;
		console.warn("Storage serialization failed:",error);
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "Storage serialization failed: " + Std.string(error)});
		return false;
	}
	try {
		com.funtomic.GameOpsStorage._storage.setItem(com.funtomic.GameOpsStorage._prefix + key,encoded);
	} catch( error1 ) {
		if (error1 instanceof js._Boot.HaxeError) error1 = error1.val;
		console.warn("localStorage.setItem failed:",error1.message);
		var locaStorageSize = -2;
		var isStorageRedirected = Reflect.field(window,"isStorageRedirected") == true;
		try {
			locaStorageSize = JSON.stringify(window.parent.localStorage).length / 1024;
		} catch( error2 ) {
			if (error2 instanceof js._Boot.HaxeError) error2 = error2.val;
			locaStorageSize = -1;
		}
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "localStorage.setItem failed: " + Std.string(error1.message), local_storage_size : locaStorageSize, is_storage_redirected : isStorageRedirected});
		com.funtomic.GameOpsStorage.clear();
		return false;
	}
	return true;
};
com.funtomic.GameOpsStorage.get = function(key,defaultValue) {
	com.funtomic.GameOpsStorage.validateInitialized();
	var encoded = null;
	try {
		encoded = com.funtomic.GameOpsStorage._storage.getItem(com.funtomic.GameOpsStorage._prefix + key);
	} catch( error ) {
		if (error instanceof js._Boot.HaxeError) error = error.val;
		console.warn("localStorage.getItem failed:",error.message);
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "localStorage.getItem failed: " + Std.string(error.message)});
	}
	if(encoded != null) try {
		return haxe.Unserializer.run(encoded);
	} catch( error1 ) {
		if (error1 instanceof js._Boot.HaxeError) error1 = error1.val;
		console.warn("Storage unserialization failed:",error1);
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "Storage unserialization failed: " + Std.string(error1)});
	}
	return defaultValue;
};
com.funtomic.GameOpsStorage.remove = function(key) {
	com.funtomic.GameOpsStorage.validateInitialized();
	try {
		com.funtomic.GameOpsStorage._storage.removeItem(com.funtomic.GameOpsStorage._prefix + key);
	} catch( error ) {
		if (error instanceof js._Boot.HaxeError) error = error.val;
		console.warn("localStorage.removeItem failed:",error.message);
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "localStorage.removeItem failed: " + Std.string(error.message)});
	}
};
com.funtomic.GameOpsStorage.clear = function() {
	com.funtomic.GameOpsStorage.validateInitialized();
	try {
		com.funtomic.GameOpsStorage._storage.clear();
	} catch( error ) {
		if (error instanceof js._Boot.HaxeError) error = error.val;
		console.warn("localStorage.clear failed:",error.message);
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "localStorage.clear failed: " + Std.string(error.message)});
	}
};
var haxe = haxe || {};
haxe.IMap = $hxClasses["haxe.IMap"] = function() { };
haxe.IMap.__name__ = ["haxe","IMap"];
haxe.Http = $hxClasses["haxe.Http"] = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.prototype = {
	setParameter: function(param,value) {
		this.params = Lambda.filter(this.params,function(p) {
			return p.param != param;
		});
		this.params.push({ param : param, value : value});
		return this;
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				if (e instanceof js._Boot.HaxeError) e = e.val;
				s = null;
			}
			if(s != null) {
				var protocol = window.location.protocol.toLowerCase();
				var rlocalProtocol = new EReg("^(?:about|app|app-storage|.+-extension|file|res|widget):$","");
				var isLocal = rlocalProtocol.match(protocol);
				if(isLocal) if(r.responseText != null) s = 200; else s = 404;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var _g_head = this.params.h;
			var _g_val = null;
			while(_g_head != null) {
				var p;
				p = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			if (e1 instanceof js._Boot.HaxeError) e1 = e1.val;
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var _g_head1 = this.headers.h;
		var _g_val1 = null;
		while(_g_head1 != null) {
			var h1;
			h1 = (function($this) {
				var $r;
				_g_val1 = _g_head1[0];
				_g_head1 = _g_head1[1];
				$r = _g_val1;
				return $r;
			}(this));
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe.Http
};
if(!haxe._Int64) haxe._Int64 = {};
haxe._Int64.___Int64 = $hxClasses["haxe._Int64.___Int64"] = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe._Int64.___Int64.__name__ = ["haxe","_Int64","___Int64"];
haxe._Int64.___Int64.prototype = {
	__class__: haxe._Int64.___Int64
};
haxe.Log = $hxClasses["haxe.Log"] = function() { };
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Serializer = $hxClasses["haxe.Serializer"] = function() {
	this.buf = new StringBuf();
	this.cache = [];
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new haxe.ds.StringMap();
	this.scount = 0;
};
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.prototype = {
	toString: function() {
		return this.buf.b;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += "R";
			if(x == null) this.buf.b += "null"; else this.buf.b += "" + x;
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = encodeURIComponent(s);
		if(s.length == null) this.buf.b += "null"; else this.buf.b += "" + s.length;
		this.buf.b += ":";
		if(s == null) this.buf.b += "null"; else this.buf.b += "" + s;
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0;
		var _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				if(i == null) this.buf.b += "null"; else this.buf.b += "" + i;
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeFields: function(v) {
		var _g = 0;
		var _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serialize: function(v) {
		{
			var _g = Type["typeof"](v);
			switch(_g[1]) {
			case 0:
				this.buf.b += "n";
				break;
			case 1:
				var v1 = v;
				if(v1 == 0) {
					this.buf.b += "z";
					return;
				}
				this.buf.b += "i";
				if(v1 == null) this.buf.b += "null"; else this.buf.b += "" + v1;
				break;
			case 2:
				var v2 = v;
				if(isNaN(v2)) this.buf.b += "k"; else if(!isFinite(v2)) if(v2 < 0) this.buf.b += "m"; else this.buf.b += "p"; else {
					this.buf.b += "d";
					if(v2 == null) this.buf.b += "null"; else this.buf.b += "" + v2;
				}
				break;
			case 3:
				if(v) this.buf.b += "t"; else this.buf.b += "f";
				break;
			case 6:
				var c = _g[2];
				if(c == String) {
					this.serializeString(v);
					return;
				}
				if(this.useCache && this.serializeRef(v)) return;
				switch(c) {
				case Array:
					var ucount = 0;
					this.buf.b += "a";
					var l = v.length;
					var _g1 = 0;
					while(_g1 < l) {
						var i = _g1++;
						if(v[i] == null) ucount++; else {
							if(ucount > 0) {
								if(ucount == 1) this.buf.b += "n"; else {
									this.buf.b += "u";
									if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
								}
								ucount = 0;
							}
							this.serialize(v[i]);
						}
					}
					if(ucount > 0) {
						if(ucount == 1) this.buf.b += "n"; else {
							this.buf.b += "u";
							if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
						}
					}
					this.buf.b += "h";
					break;
				case List:
					this.buf.b += "l";
					var v3 = v;
					var _g1_head = v3.h;
					var _g1_val = null;
					while(_g1_head != null) {
						var i1;
						_g1_val = _g1_head[0];
						_g1_head = _g1_head[1];
						i1 = _g1_val;
						this.serialize(i1);
					}
					this.buf.b += "h";
					break;
				case Date:
					var d = v;
					this.buf.b += "v";
					this.buf.add(d.getTime());
					break;
				case haxe.ds.StringMap:
					this.buf.b += "b";
					var v4 = v;
					var $it0 = v4.keys();
					while( $it0.hasNext() ) {
						var k = $it0.next();
						this.serializeString(k);
						this.serialize(__map_reserved[k] != null?v4.getReserved(k):v4.h[k]);
					}
					this.buf.b += "h";
					break;
				case haxe.ds.IntMap:
					this.buf.b += "q";
					var v5 = v;
					var $it1 = v5.keys();
					while( $it1.hasNext() ) {
						var k1 = $it1.next();
						this.buf.b += ":";
						if(k1 == null) this.buf.b += "null"; else this.buf.b += "" + k1;
						this.serialize(v5.h[k1]);
					}
					this.buf.b += "h";
					break;
				case haxe.ds.ObjectMap:
					this.buf.b += "M";
					var v6 = v;
					var $it2 = v6.keys();
					while( $it2.hasNext() ) {
						var k2 = $it2.next();
						var id = Reflect.field(k2,"__id__");
						Reflect.deleteField(k2,"__id__");
						this.serialize(k2);
						k2.__id__ = id;
						this.serialize(v6.h[k2.__id__]);
					}
					this.buf.b += "h";
					break;
				case haxe.io.Bytes:
					var v7 = v;
					var i2 = 0;
					var max = v7.length - 2;
					var charsBuf = new StringBuf();
					var b64 = haxe.Serializer.BASE64;
					while(i2 < max) {
						var b1 = v7.get(i2++);
						var b2 = v7.get(i2++);
						var b3 = v7.get(i2++);
						charsBuf.add(b64.charAt(b1 >> 2));
						charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
						charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
						charsBuf.add(b64.charAt(b3 & 63));
					}
					if(i2 == max) {
						var b11 = v7.get(i2++);
						var b21 = v7.get(i2++);
						charsBuf.add(b64.charAt(b11 >> 2));
						charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
						charsBuf.add(b64.charAt(b21 << 2 & 63));
					} else if(i2 == max + 1) {
						var b12 = v7.get(i2++);
						charsBuf.add(b64.charAt(b12 >> 2));
						charsBuf.add(b64.charAt(b12 << 4 & 63));
					}
					var chars = charsBuf.b;
					this.buf.b += "s";
					if(chars.length == null) this.buf.b += "null"; else this.buf.b += "" + chars.length;
					this.buf.b += ":";
					if(chars == null) this.buf.b += "null"; else this.buf.b += "" + chars;
					break;
				default:
					if(this.useCache) this.cache.pop();
					if(v.hxSerialize != null) {
						this.buf.b += "C";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						v.hxSerialize(this);
						this.buf.b += "g";
					} else {
						this.buf.b += "c";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						this.serializeFields(v);
					}
				}
				break;
			case 4:
				if(js.Boot.__instanceof(v,Class)) {
					var className = Type.getClassName(v);
					this.buf.b += "A";
					this.serializeString(className);
				} else if(js.Boot.__instanceof(v,Enum)) {
					this.buf.b += "B";
					this.serializeString(Type.getEnumName(v));
				} else {
					if(this.useCache && this.serializeRef(v)) return;
					this.buf.b += "o";
					this.serializeFields(v);
				}
				break;
			case 7:
				var e = _g[2];
				if(this.useCache) {
					if(this.serializeRef(v)) return;
					this.cache.pop();
				}
				if(this.useEnumIndex) this.buf.b += "j"; else this.buf.b += "w";
				this.serializeString(Type.getEnumName(e));
				if(this.useEnumIndex) {
					this.buf.b += ":";
					this.buf.b += Std.string(v[1]);
				} else this.serializeString(v[0]);
				this.buf.b += ":";
				var l1 = v.length;
				this.buf.b += Std.string(l1 - 2);
				var _g11 = 2;
				while(_g11 < l1) {
					var i3 = _g11++;
					this.serialize(v[i3]);
				}
				if(this.useCache) this.cache.push(v);
				break;
			case 5:
				throw new js._Boot.HaxeError("Cannot serialize function");
				break;
			default:
				throw new js._Boot.HaxeError("Cannot serialize " + Std.string(v));
			}
		}
	}
	,__class__: haxe.Serializer
};
haxe.Timer = $hxClasses["haxe.Timer"] = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.prototype = {
	run: function() {
	}
	,__class__: haxe.Timer
};
haxe.Unserializer = $hxClasses["haxe.Unserializer"] = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = [];
	this.cache = [];
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = [];
	var _g1 = 0;
	var _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
};
haxe.Unserializer.prototype = {
	setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,readFloat: function() {
		var p1 = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
		}
		return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw new js._Boot.HaxeError("Invalid object");
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw new js._Boot.HaxeError("Invalid object key");
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw new js._Boot.HaxeError("Invalid enum format");
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = [];
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			return this.readFloat();
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw new js._Boot.HaxeError("Invalid string length");
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return NaN;
		case 109:
			return -Infinity;
		case 112:
			return Infinity;
		case 97:
			var buf = this.buf;
			var a = [];
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw new js._Boot.HaxeError("Invalid reference");
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw new js._Boot.HaxeError("Invalid string reference");
			return this.scache[n2];
		case 120:
			throw new js._Boot.HaxeError(this.unserialize());
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw new js._Boot.HaxeError("Class not found " + name);
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw new js._Boot.HaxeError("Enum not found " + name1);
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw new js._Boot.HaxeError("Enum not found " + name2);
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw new js._Boot.HaxeError("Unknown enum index " + name2 + "@" + index);
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe.ds.StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe.ds.IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c1 = this.get(this.pos++);
			while(c1 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c1 = this.get(this.pos++);
			}
			if(c1 != 104) throw new js._Boot.HaxeError("Invalid IntMap format");
			return h1;
		case 77:
			var h2 = new haxe.ds.ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			if(this.buf.charCodeAt(this.pos) >= 48 && this.buf.charCodeAt(this.pos) <= 57 && this.buf.charCodeAt(this.pos + 1) >= 48 && this.buf.charCodeAt(this.pos + 1) <= 57 && this.buf.charCodeAt(this.pos + 2) >= 48 && this.buf.charCodeAt(this.pos + 2) <= 57 && this.buf.charCodeAt(this.pos + 3) >= 48 && this.buf.charCodeAt(this.pos + 3) <= 57 && this.buf.charCodeAt(this.pos + 4) == 45) {
				var s3 = HxOverrides.substr(this.buf,this.pos,19);
				d = HxOverrides.strDate(s3);
				this.pos += 19;
			} else {
				var t = this.readFloat();
				var d1 = new Date();
				d1.setTime(t);
				d = d1;
			}
			this.cache.push(d);
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw new js._Boot.HaxeError("Invalid bytes length");
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c2 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c2 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c2 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c21 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c21 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw new js._Boot.HaxeError("Class not found " + name3);
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw new js._Boot.HaxeError("Invalid custom data");
			return o2;
		case 65:
			var name4 = this.unserialize();
			var cl2 = this.resolver.resolveClass(name4);
			if(cl2 == null) throw new js._Boot.HaxeError("Class not found " + name4);
			return cl2;
		case 66:
			var name5 = this.unserialize();
			var e2 = this.resolver.resolveEnum(name5);
			if(e2 == null) throw new js._Boot.HaxeError("Enum not found " + name5);
			return e2;
		default:
		}
		this.pos--;
		throw new js._Boot.HaxeError("Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos);
	}
	,__class__: haxe.Unserializer
};
if(!haxe.ds) haxe.ds = {};
haxe.ds.IntMap = $hxClasses["haxe.ds.IntMap"] = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [haxe.IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = $hxClasses["haxe.ds.ObjectMap"] = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [haxe.IMap];
haxe.ds.ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.StringMap = $hxClasses["haxe.ds.StringMap"] = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [haxe.IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,__class__: haxe.ds.StringMap
};
if(!haxe.io) haxe.io = {};
haxe.io.Bytes = $hxClasses["haxe.io.Bytes"] = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	return new haxe.io.Bytes(new ArrayBuffer(length));
};
haxe.io.Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,__class__: haxe.io.Bytes
};
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
haxe.io.FPHelper = $hxClasses["haxe.io.FPHelper"] = function() { };
haxe.io.FPHelper.__name__ = ["haxe","io","FPHelper"];
haxe.io.FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe.io.FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe.io.FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe.io.FPHelper.doubleToI64 = function(v) {
	var i64 = haxe.io.FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var js = js || {};
if(!js._Boot) js._Boot = {};
js._Boot.HaxeError = $hxClasses["js._Boot.HaxeError"] = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js._Boot.HaxeError);
};
js._Boot.HaxeError.__name__ = ["js","_Boot","HaxeError"];
js._Boot.HaxeError.__super__ = Error;
js._Boot.HaxeError.prototype = $extend(Error.prototype,{
	__class__: js._Boot.HaxeError
});
js.Boot = $hxClasses["js.Boot"] = function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js.Boot.__nativeClassName(o);
		if(name != null) return js.Boot.__resolveNativeClass(name);
		return null;
	}
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js.Boot.__string_rec(o[i1],s); else str2 += js.Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js.Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__nativeClassName = function(o) {
	var name = js.Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js.Boot.__isNativeObj = function(o) {
	return js.Boot.__nativeClassName(o) != null;
};
js.Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
js.Browser = $hxClasses["js.Browser"] = function() { };
js.Browser.__name__ = ["js","Browser"];
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw new js._Boot.HaxeError("Unable to create XMLHttpRequest object.");
};
if(!js.html) js.html = {};
if(!js.html.compat) js.html.compat = {};
js.html.compat.ArrayBuffer = $hxClasses["js.html.compat.ArrayBuffer"] = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
js.html.compat.ArrayBuffer.__name__ = ["js","html","compat","ArrayBuffer"];
js.html.compat.ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js.html.compat.ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js.html.compat.ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js.html.compat.ArrayBuffer
};
js.html.compat.DataView = $hxClasses["js.html.compat.DataView"] = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js._Boot.HaxeError(haxe.io.Error.OutsideBounds);
};
js.html.compat.DataView.__name__ = ["js","html","compat","DataView"];
js.html.compat.DataView.prototype = {
	getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe.io.FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe.io.FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe.io.FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe.io.FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js.html.compat.DataView
};
js.html.compat.Uint8Array = $hxClasses["js.html.compat.Uint8Array"] = function() { };
js.html.compat.Uint8Array.__name__ = ["js","html","compat","Uint8Array"];
js.html.compat.Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js.html.compat.ArrayBuffer(arr);
	} else if(js.Boot.__instanceof(arg1,js.html.compat.ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js.html.compat.ArrayBuffer(arr);
	} else throw new js._Boot.HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js.html.compat.Uint8Array._subarray;
	arr.set = js.html.compat.Uint8Array._set;
	return arr;
};
js.html.compat.Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js.Boot.__instanceof(arg.buffer,js.html.compat.ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js._Boot.HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js._Boot.HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js._Boot.HaxeError("TODO");
};
js.html.compat.Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js.html.compat.Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
var ArrayBuffer = $global.ArrayBuffer || js.html.compat.ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js.html.compat.ArrayBuffer.sliceImpl;
var DataView = $global.DataView || js.html.compat.DataView;
var Uint8Array = $global.Uint8Array || js.html.compat.Uint8Array._new;
com.funtomic.GameOps.isEventsTraceOnly = false;
com.funtomic.GameOps.apiURLPrefix = "http://tools.funtomic.com/";
com.funtomic.GameOps.gameOpsVersion = "0.7.8";
com.funtomic.GameOps.apiEventsLocation = "v2/events/";
com.funtomic.GameOps.apiTokensLocation = "v1/game_data/";
com.funtomic.GameOps.apiConfigLocation = "v1/config/";
com.funtomic.GameOps.apiSetUserEmailLocation = "v1/user_email_set/";
com.funtomic.GameOps.status = com.funtomic.GameOpsStatus.UNINITIALIZED;
com.funtomic.GameOps.onInitDoneFunctions = [];
com.funtomic.GameOps.MAX_SAVED_UNSENT_EVENTS = 1000;
com.funtomic.GameOps.localStorage = { };
com.funtomic.GameOps.gameStateGameOpsData = { };
com.funtomic.GameOps.gameOpsNEListeners = { };
com.funtomic.GameOps.flags = { };
com.funtomic.GameOps.productsInfoCache = { };
com.funtomic.GameOps.firstSession = false;
com.funtomic.GameOps.isDebugMode = false;
com.funtomic.GameOps.levelsNumbers = [];
com.funtomic.GameOps.deferredReportEvents = [];
com.funtomic.GameOps.movesDuration = [];
com.funtomic.GameOps.timers = { };
com.funtomic.GameOpsIAP.status = com.funtomic.GameOpsStatus.UNINITIALIZED;
com.funtomic.GameOpsIAP.callbacksCounter = 0;
com.funtomic.GameOpsIAP.jsInterface = { };
com.funtomic.GameOpsIAP.innerProductsInfo = { };
com.funtomic.GameOpsLogger.logLevel = 0;
com.funtomic.GameOpsStorage._prefix = "";
com.funtomic.GameOpsStorage._isErrorEventsSent = 0;
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
haxe.io.FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe._Int64.___Int64(0,0);
	$r = x;
	return $r;
}(this));
js.Boot.__toStr = {}.toString;
js.html.compat.Uint8Array.BYTES_PER_ELEMENT = 1;