window.skins={};
                function __extends(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                        function __() {
                            this.constructor = d;
                        }
                    __.prototype = b.prototype;
                    d.prototype = new __();
                };
                window.generateEUI = {};
                generateEUI.paths = {};
                generateEUI.styles = undefined;
                generateEUI.skins = {"eui.Button":"resource/eui_skins/ButtonSkin.exml","eui.CheckBox":"resource/eui_skins/CheckBoxSkin.exml","eui.HScrollBar":"resource/eui_skins/HScrollBarSkin.exml","eui.HSlider":"resource/eui_skins/HSliderSkin.exml","eui.Panel":"resource/eui_skins/PanelSkin.exml","eui.TextInput":"resource/eui_skins/TextInputSkin.exml","eui.ProgressBar":"resource/eui_skins/ProgressBarSkin.exml","eui.RadioButton":"resource/eui_skins/RadioButtonSkin.exml","eui.Scroller":"resource/eui_skins/ScrollerSkin.exml","eui.ToggleSwitch":"resource/eui_skins/ToggleSwitchSkin.exml","eui.VScrollBar":"resource/eui_skins/VScrollBarSkin.exml","eui.VSlider":"resource/eui_skins/VSliderSkin.exml","eui.ItemRenderer":"resource/eui_skins/ItemRendererSkin.exml","shop":"resource/eui_skins/shop.exml","GameOver":"resource/eui_skins/GameOver.exml","GameMed2":"resource/eui_skins/GameMed2.exml","GameUiZu":"resource/eui_skins/GameUiZu.exml"};generateEUI.paths['resource/eui_skins/ButtonSkin.exml'] = window.skins.ButtonSkin = (function (_super) {
	__extends(ButtonSkin, _super);
	function ButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay","iconDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i(),this.iconDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
	}
	var _proto = ButtonSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		return t;
	};
	return ButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/CheckBoxSkin.exml'] = window.skins.CheckBoxSkin = (function (_super) {
	__extends(CheckBoxSkin, _super);
	function CheckBoxSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_disabled_png")
				])
		];
	}
	var _proto = CheckBoxSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "checkbox_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return CheckBoxSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/GameMed1.exml'] = window.GameMed1 = (function (_super) {
	__extends(GameMed1, _super);
	function GameMed1() {
		_super.call(this);
		this.skinParts = ["gamebg","dibiao5","dibiao7","dibiao2","dibiao1","role1","role2","dibiao","dibiao6","dibiao0","dibiao3","dibiao4","dibiao8","qiuwang1","qiuwang4","qiuwang2","qiuwang5","qiuwang3","qiuwang0","zuqiu"];
		
		this.height = 500;
		this.width = 800;
		this.elementsContent = [this.gamebg_i(),this.dibiao5_i(),this.dibiao7_i(),this.dibiao2_i(),this.dibiao1_i(),this.role1_i(),this.role2_i(),this.dibiao_i(),this.dibiao6_i(),this.dibiao0_i(),this.dibiao3_i(),this.dibiao4_i(),this.dibiao8_i(),this.qiuwang1_i(),this.qiuwang4_i(),this.qiuwang2_i(),this.qiuwang5_i(),this.qiuwang3_i(),this.qiuwang0_i(),this.zuqiu_i()];
	}
	var _proto = GameMed1.prototype;

	_proto.gamebg_i = function () {
		var t = new eui.Image();
		this.gamebg = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 500;
		t.source = "gamebg2_png";
		t.width = 800;
		t.x = -1;
		t.y = 1;
		return t;
	};
	_proto.dibiao5_i = function () {
		var t = new eui.Image();
		this.dibiao5 = t;
		t.anchorOffsetX = 60;
		t.anchorOffsetY = 51.36;
		t.height = 107;
		t.name = "dibiao";
		t.source = "dibiao_png";
		t.width = 120;
		t.x = 739;
		t.y = 397.36;
		return t;
	};
	_proto.dibiao7_i = function () {
		var t = new eui.Image();
		this.dibiao7 = t;
		t.anchorOffsetX = 8.5;
		t.anchorOffsetY = 9.6;
		t.height = 20;
		t.name = "dibiao";
		t.source = "dibiao_png";
		t.width = 17;
		t.x = 687.01;
		t.y = 335.6;
		return t;
	};
	_proto.dibiao2_i = function () {
		var t = new eui.Image();
		this.dibiao2 = t;
		t.anchorOffsetX = 15;
		t.anchorOffsetY = 188.16;
		t.height = 392;
		t.name = "dibiao";
		t.source = "dibiao_png";
		t.width = 30;
		t.x = 810;
		t.y = 191.66;
		return t;
	};
	_proto.dibiao1_i = function () {
		var t = new eui.Image();
		this.dibiao1 = t;
		t.anchorOffsetX = 15;
		t.anchorOffsetY = 188.16;
		t.height = 392;
		t.name = "dibiao";
		t.source = "dibiao_png";
		t.width = 30;
		t.x = -11.5;
		t.y = 191.66;
		return t;
	};
	_proto.role1_i = function () {
		var t = new eui.Image();
		this.role1 = t;
		t.anchorOffsetX = 21.76;
		t.anchorOffsetY = 43.81;
		t.height = 91;
		t.name = "role1";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "role1png_png";
		t.width = 41;
		t.x = 269.76;
		t.y = 379.31;
		return t;
	};
	_proto.role2_i = function () {
		var t = new eui.Image();
		this.role2 = t;
		t.anchorOffsetX = 21.59;
		t.anchorOffsetY = 44.3;
		t.height = 90;
		t.name = "role2";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "role4png_png";
		t.width = 42;
		t.x = 555.73;
		t.y = 380.8;
		return t;
	};
	_proto.dibiao_i = function () {
		var t = new eui.Image();
		this.dibiao = t;
		t.anchorOffsetX = 60;
		t.anchorOffsetY = 50.88;
		t.height = 106;
		t.name = "dibiao";
		t.source = "dibiao_png";
		t.width = 120;
		t.x = 60.5;
		t.y = 397.88;
		return t;
	};
	_proto.dibiao6_i = function () {
		var t = new eui.Image();
		this.dibiao6 = t;
		t.anchorOffsetX = 9.5;
		t.anchorOffsetY = 9.6;
		t.height = 20;
		t.name = "dibiao";
		t.source = "dibiao_png";
		t.width = 19;
		t.x = 111;
		t.y = 338.6;
		return t;
	};
	_proto.dibiao0_i = function () {
		var t = new eui.Image();
		this.dibiao0 = t;
		t.anchorOffsetX = 401.5;
		t.anchorOffsetY = 31.68;
		t.height = 66;
		t.name = "dibiao";
		t.source = "dibiao_png";
		t.width = 803;
		t.x = 401;
		t.y = 465.18;
		return t;
	};
	_proto.dibiao3_i = function () {
		var t = new eui.Image();
		this.dibiao3 = t;
		t.anchorOffsetX = 52.91;
		t.anchorOffsetY = 8.98;
		t.height = 18.72;
		t.name = "dibiao";
		t.rotation = 10.64;
		t.source = "dibiao_png";
		t.width = 105.81;
		t.x = 54.24;
		t.y = 192.75;
		return t;
	};
	_proto.dibiao4_i = function () {
		var t = new eui.Image();
		this.dibiao4 = t;
		t.anchorOffsetX = 52.91;
		t.anchorOffsetY = 8.98;
		t.height = 18.72;
		t.name = "dibiao";
		t.rotation = 336.46;
		t.source = "dibiao_png";
		t.width = 105.81;
		t.x = 742.61;
		t.y = 185.8;
		return t;
	};
	_proto.dibiao8_i = function () {
		var t = new eui.Image();
		this.dibiao8 = t;
		t.anchorOffsetX = 400;
		t.anchorOffsetY = 12;
		t.height = 25;
		t.name = "dibiao";
		t.source = "dibiao_png";
		t.width = 800;
		t.x = 403.5;
		t.y = -9.5;
		return t;
	};
	_proto.qiuwang1_i = function () {
		var t = new eui.Image();
		this.qiuwang1 = t;
		t.anchorOffsetX = 10;
		t.anchorOffsetY = 65.76;
		t.height = 137;
		t.name = "qiuwang1";
		t.source = "dibiao_png";
		t.width = 20;
		t.x = 14.5;
		t.y = 268.76;
		return t;
	};
	_proto.qiuwang4_i = function () {
		var t = new eui.Image();
		this.qiuwang4 = t;
		t.anchorOffsetX = 48;
		t.anchorOffsetY = 9.12;
		t.height = 19;
		t.name = "qiuwang1";
		t.source = "dibiao_png";
		t.width = 96;
		t.x = 54.5;
		t.y = 338.12;
		return t;
	};
	_proto.qiuwang2_i = function () {
		var t = new eui.Image();
		this.qiuwang2 = t;
		t.anchorOffsetX = 10;
		t.anchorOffsetY = 65.76;
		t.height = 137;
		t.name = "qiuwang2";
		t.source = "dibiao_png";
		t.width = 20;
		t.x = 783;
		t.y = 267.26;
		return t;
	};
	_proto.qiuwang5_i = function () {
		var t = new eui.Image();
		this.qiuwang5 = t;
		t.anchorOffsetX = 45.5;
		t.anchorOffsetY = 10.08;
		t.height = 21;
		t.name = "qiuwang2";
		t.source = "dibiao_png";
		t.width = 91;
		t.x = 741.01;
		t.y = 336.08;
		return t;
	};
	_proto.qiuwang3_i = function () {
		var t = new eui.Image();
		this.qiuwang3 = t;
		t.anchorOffsetX = 35.97;
		t.anchorOffsetY = 5.86;
		t.height = 12.21;
		t.name = "qiuwang3";
		t.rotation = 359.61;
		t.source = "dibiao_png";
		t.width = 71.95;
		t.x = 749.5;
		t.y = 207.61;
		return t;
	};
	_proto.qiuwang0_i = function () {
		var t = new eui.Image();
		this.qiuwang0 = t;
		t.anchorOffsetX = 40.47;
		t.anchorOffsetY = 5.78;
		t.height = 12.04;
		t.name = "qiuwang3";
		t.rotation = 359.61;
		t.source = "dibiao_png";
		t.width = 80.95;
		t.x = 47.01;
		t.y = 210.1;
		return t;
	};
	_proto.zuqiu_i = function () {
		var t = new eui.Image();
		this.zuqiu = t;
		t.anchorOffsetX = 15;
		t.anchorOffsetY = 15;
		t.height = 30;
		t.name = "zuqiu";
		t.source = "./resource/assets/games/zuqiu.png";
		t.width = 30;
		t.x = 408;
		t.y = 250;
		return t;
	};
	return GameMed1;
})(eui.Skin);generateEUI.paths['resource/eui_skins/GameMed2.exml'] = window.GameMed2Skin = (function (_super) {
	__extends(GameMed2Skin, _super);
	function GameMed2Skin() {
		_super.call(this);
		this.skinParts = ["gamebg","paotong1_13","paotong2_19","dibiao2","dibiao1","role1","dibiao","role2","role3","paotong1_8","scoretx0","goldtx0","shutext0","jiahao0","scoregroup","guaishoua_1_1000_zuo_2","guaishoub_1_900_zuo_2","lglg0","lglg1"];
		
		this.height = 500;
		this.width = 800;
		this.elementsContent = [this.gamebg_i(),this.paotong1_13_i(),this.paotong2_19_i(),this.dibiao2_i(),this.dibiao1_i(),this.role1_i(),this.dibiao_i(),this.role2_i(),this.role3_i(),this.paotong1_8_i(),this.scoregroup_i(),this.guaishoua_1_1000_zuo_2_i(),this.guaishoub_1_900_zuo_2_i(),this.lglg0_i(),this.lglg1_i()];
	}
	var _proto = GameMed2Skin.prototype;

	_proto.gamebg_i = function () {
		var t = new eui.Image();
		this.gamebg = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 500;
		t.source = "gamebg3_png";
		t.width = 800;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.paotong1_13_i = function () {
		var t = new eui.Image();
		this.paotong1_13 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 69;
		t.name = "paotong1_13";
		t.scaleY = 1;
		t.source = "paotong3_png";
		t.width = 42;
		t.x = -3.5;
		t.y = 171;
		return t;
	};
	_proto.paotong2_19_i = function () {
		var t = new eui.Image();
		this.paotong2_19 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 69;
		t.name = "paotong2_19";
		t.scaleY = 1;
		t.source = "paotong4_png";
		t.width = 35;
		t.x = 761.5;
		t.y = 42;
		return t;
	};
	_proto.dibiao2_i = function () {
		var t = new eui.Image();
		this.dibiao2 = t;
		t.anchorOffsetX = 15;
		t.anchorOffsetY = 188.16;
		t.height = 392;
		t.name = "dibiao";
		t.source = "dibiao_png";
		t.width = 30;
		t.x = 810;
		t.y = 191.66;
		return t;
	};
	_proto.dibiao1_i = function () {
		var t = new eui.Image();
		this.dibiao1 = t;
		t.anchorOffsetX = 15;
		t.anchorOffsetY = 188.16;
		t.height = 392;
		t.name = "dibiao";
		t.source = "dibiao_png";
		t.width = 30;
		t.x = -11.5;
		t.y = 191.66;
		return t;
	};
	_proto.role1_i = function () {
		var t = new eui.Image();
		this.role1 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 81;
		t.name = "role1";
		t.source = "peiqi0_png";
		t.width = 60;
		t.x = 321;
		t.y = 305;
		return t;
	};
	_proto.dibiao_i = function () {
		var t = new eui.Image();
		this.dibiao = t;
		t.anchorOffsetX = 400;
		t.anchorOffsetY = 12;
		t.height = 25;
		t.name = "dibiao";
		t.source = "dibiao_png";
		t.width = 800;
		t.x = 400;
		t.y = 398;
		return t;
	};
	_proto.role2_i = function () {
		var t = new eui.Image();
		this.role2 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 87;
		t.name = "role2";
		t.source = "role22_png";
		t.width = 62;
		t.x = 230;
		t.y = 299;
		return t;
	};
	_proto.role3_i = function () {
		var t = new eui.Image();
		this.role3 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 88;
		t.name = "role3";
		t.source = "role33_png";
		t.width = 62;
		t.x = 400;
		t.y = 284;
		return t;
	};
	_proto.paotong1_8_i = function () {
		var t = new eui.Image();
		this.paotong1_8 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 69;
		t.name = "paotong1_4";
		t.scaleY = 1;
		t.source = "paotong_png";
		t.width = 42;
		t.x = -7.5;
		t.y = 42;
		return t;
	};
	_proto.scoregroup_i = function () {
		var t = new eui.Group();
		this.scoregroup = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 46;
		t.name = "scoregroup";
		t.width = 500;
		t.x = 133;
		t.y = 446;
		t.elementsContent = [this.scoretx0_i(),this.goldtx0_i(),this._Image1_i(),this.shutext0_i(),this.jiahao0_i()];
		return t;
	};
	_proto.scoretx0_i = function () {
		var t = new eui.Label();
		this.scoretx0 = t;
		t.anchorOffsetX = 0;
		t.bold = true;
		t.fontFamily = "SimHei";
		t.name = "scoretx";
		t.size = 25;
		t.text = "得分 888";
		t.textColor = 0xFFCB4A;
		t.width = 160;
		t.x = 0;
		t.y = 10;
		return t;
	};
	_proto.goldtx0_i = function () {
		var t = new eui.Label();
		this.goldtx0 = t;
		t.anchorOffsetX = 0;
		t.bold = true;
		t.fontFamily = "SimHei";
		t.name = "goldtx";
		t.size = 25;
		t.text = "金币 888";
		t.textColor = 0xFFCB4A;
		t.width = 141;
		t.x = 183;
		t.y = 7;
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "wutubiao_png";
		t.x = 341;
		t.y = 0;
		return t;
	};
	_proto.shutext0_i = function () {
		var t = new eui.Label();
		this.shutext0 = t;
		t.anchorOffsetX = 0;
		t.bold = true;
		t.fontFamily = "SimHei";
		t.name = "shutext";
		t.size = 30;
		t.text = "22";
		t.textColor = 0xFF9A00;
		t.width = 65;
		t.x = 400.5;
		t.y = 6.5;
		return t;
	};
	_proto.jiahao0_i = function () {
		var t = new eui.Image();
		this.jiahao0 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 33;
		t.name = "jiahao";
		t.source = "jiahao_png";
		t.visible = false;
		t.width = 20;
		t.x = 187;
		t.y = 38;
		return t;
	};
	_proto.guaishoua_1_1000_zuo_2_i = function () {
		var t = new eui.Image();
		this.guaishoua_1_1000_zuo_2 = t;
		t.anchorOffsetX = 23;
		t.anchorOffsetY = 21;
		t.height = 41;
		t.name = "guaishoua_1_1200_zuo_3";
		t.source = "ciqiupng_png";
		t.width = 46;
		t.x = 36.5;
		t.y = 352;
		return t;
	};
	_proto.guaishoub_1_900_zuo_2_i = function () {
		var t = new eui.Image();
		this.guaishoub_1_900_zuo_2 = t;
		t.anchorOffsetX = 39.5;
		t.anchorOffsetY = 38.41;
		t.height = 75;
		t.name = "guaishoub_1_900_zuo_2";
		t.source = "guanwubpng_png";
		t.width = 79;
		t.x = 254.5;
		t.y = 20.91;
		return t;
	};
	_proto.lglg0_i = function () {
		var t = new eui.Image();
		this.lglg0 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 26;
		t.name = "lglg43";
		t.source = "./resource/assets/games/lg49.png";
		t.width = 69;
		t.x = 74;
		t.y = 131;
		return t;
	};
	_proto.lglg1_i = function () {
		var t = new eui.Image();
		this.lglg1 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 26;
		t.name = "lglg43";
		t.source = "./resource/assets/games/lg49.png";
		t.width = 69;
		t.x = 710;
		t.y = 353;
		return t;
	};
	return GameMed2Skin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/GameOver.exml'] = window.GameOverSkin = (function (_super) {
	__extends(GameOverSkin, _super);
	var GameOverSkin$Skin1 = 	(function (_super) {
		__extends(GameOverSkin$Skin1, _super);
		function GameOverSkin$Skin1() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","moreBt2_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GameOverSkin$Skin1.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "moreBt1_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GameOverSkin$Skin1;
	})(eui.Skin);

	var GameOverSkin$Skin2 = 	(function (_super) {
		__extends(GameOverSkin$Skin2, _super);
		function GameOverSkin$Skin2() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","fanhuiBt_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GameOverSkin$Skin2.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "fanhuiBt2_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GameOverSkin$Skin2;
	})(eui.Skin);

	function GameOverSkin() {
		_super.call(this);
		this.skinParts = ["_biaoti","_role1","_role2","_bifen","MathGames"];
		
		this.height = 500;
		this.width = 800;
		this.elementsContent = [this._Image1_i(),this._biaoti_i(),this._role1_i(),this._role2_i(),this._Button1_i(),this._Button2_i(),this._bifen_i(),this.MathGames_i()];
	}
	var _proto = GameOverSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.height = 500;
		t.source = "gameOverBg_png";
		return t;
	};
	_proto._biaoti_i = function () {
		var t = new eui.Image();
		this._biaoti = t;
		t.height = 76;
		t.source = "ov_1VS1_png";
		t.width = 274;
		t.x = 497;
		t.y = 23;
		return t;
	};
	_proto._role1_i = function () {
		var t = new eui.Image();
		this._role1 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 145;
		t.source = "role1png_png";
		t.width = 62;
		t.x = 528;
		t.y = 229;
		return t;
	};
	_proto._role2_i = function () {
		var t = new eui.Image();
		this._role2 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 145;
		t.scaleX = -1;
		t.source = "role2png_png";
		t.width = 62;
		t.x = 738;
		t.y = 229;
		return t;
	};
	_proto._Button1_i = function () {
		var t = new eui.Button();
		t.label = "";
		t.name = "moreBt";
		t.x = 518;
		t.y = 411;
		t.skinName = GameOverSkin$Skin1;
		return t;
	};
	_proto._Button2_i = function () {
		var t = new eui.Button();
		t.label = "";
		t.name = "fanhuiBt";
		t.x = 666;
		t.y = 411;
		t.skinName = GameOverSkin$Skin2;
		return t;
	};
	_proto._bifen_i = function () {
		var t = new eui.BitmapLabel();
		this._bifen = t;
		t.font = "ovziti_fnt";
		t.text = "1+2";
		t.x = 546;
		t.y = 120;
		return t;
	};
	_proto.MathGames_i = function () {
		var t = new eui.Image();
		this.MathGames = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 44;
		t.name = "MathGames";
		t.source = "./resource/assets/games/42.png";
		t.width = 149;
		t.x = 291.25;
		t.y = 432;
		return t;
	};
	return GameOverSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/GameUiZu.exml'] = window.GameUiZuSkin = (function (_super) {
	__extends(GameUiZuSkin, _super);
	var GameUiZuSkin$Skin3 = 	(function (_super) {
		__extends(GameUiZuSkin$Skin3, _super);
		function GameUiZuSkin$Skin3() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","eBt2_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GameUiZuSkin$Skin3.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "eBt1_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GameUiZuSkin$Skin3;
	})(eui.Skin);

	var GameUiZuSkin$Skin4 = 	(function (_super) {
		__extends(GameUiZuSkin$Skin4, _super);
		function GameUiZuSkin$Skin4() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","chongzhiBt2_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GameUiZuSkin$Skin4.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "chongzhiBt1_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GameUiZuSkin$Skin4;
	})(eui.Skin);

	var GameUiZuSkin$Skin5 = 	(function (_super) {
		__extends(GameUiZuSkin$Skin5, _super);
		function GameUiZuSkin$Skin5() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","zhuyeBt2_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GameUiZuSkin$Skin5.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "zhuyeBt1_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GameUiZuSkin$Skin5;
	})(eui.Skin);

	var GameUiZuSkin$Skin6 = 	(function (_super) {
		__extends(GameUiZuSkin$Skin6, _super);
		function GameUiZuSkin$Skin6() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","soundBt2_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GameUiZuSkin$Skin6.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "soundBt1_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GameUiZuSkin$Skin6;
	})(eui.Skin);

	var GameUiZuSkin$Skin7 = 	(function (_super) {
		__extends(GameUiZuSkin$Skin7, _super);
		function GameUiZuSkin$Skin7() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","jtshangBt2_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GameUiZuSkin$Skin7.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "jtshangBt1_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GameUiZuSkin$Skin7;
	})(eui.Skin);

	var GameUiZuSkin$Skin8 = 	(function (_super) {
		__extends(GameUiZuSkin$Skin8, _super);
		function GameUiZuSkin$Skin8() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","tiqiuBt2_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GameUiZuSkin$Skin8.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "tiqiuBt1_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GameUiZuSkin$Skin8;
	})(eui.Skin);

	var GameUiZuSkin$Skin9 = 	(function (_super) {
		__extends(GameUiZuSkin$Skin9, _super);
		function GameUiZuSkin$Skin9() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","jtyouBt2_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GameUiZuSkin$Skin9.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "jtyouBt1_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GameUiZuSkin$Skin9;
	})(eui.Skin);

	var GameUiZuSkin$Skin10 = 	(function (_super) {
		__extends(GameUiZuSkin$Skin10, _super);
		function GameUiZuSkin$Skin10() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","jtzuoBt2_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GameUiZuSkin$Skin10.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "jtzuoBt1_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GameUiZuSkin$Skin10;
	})(eui.Skin);

	function GameUiZuSkin() {
		_super.call(this);
		this.skinParts = ["_Bg","_texttime","eBt","chongzhiBt","homeBt","soundBt","jtshangBt","tiqiuBt","jtyouBt","jtzuoBt","_textbifen1","_textbifen2","MathGames"];
		
		this.height = 500;
		this.width = 800;
		this.elementsContent = [this._Bg_i(),this._texttime_i(),this.eBt_i(),this.chongzhiBt_i(),this.homeBt_i(),this.soundBt_i(),this.jtshangBt_i(),this.tiqiuBt_i(),this.jtyouBt_i(),this.jtzuoBt_i(),this._textbifen1_i(),this._textbifen2_i(),this.MathGames_i()];
	}
	var _proto = GameUiZuSkin.prototype;

	_proto._Bg_i = function () {
		var t = new eui.Image();
		this._Bg = t;
		t.height = 500;
		t.source = "gamebg2_png";
		t.visible = false;
		t.width = 800;
		return t;
	};
	_proto._texttime_i = function () {
		var t = new eui.Label();
		this._texttime = t;
		t.anchorOffsetX = 0;
		t.fontFamily = "方正综艺简体";
		t.size = 30;
		t.stroke = 1.5;
		t.strokeColor = 0xff0000;
		t.text = "00";
		t.textColor = 0xffd54a;
		t.x = 65;
		t.y = 15;
		return t;
	};
	_proto.eBt_i = function () {
		var t = new eui.Button();
		this.eBt = t;
		t.label = "";
		t.name = "eBt";
		t.x = 546;
		t.y = 3;
		t.skinName = GameUiZuSkin$Skin3;
		return t;
	};
	_proto.chongzhiBt_i = function () {
		var t = new eui.Button();
		this.chongzhiBt = t;
		t.label = "";
		t.name = "chongzhiBt";
		t.x = 672;
		t.y = 3;
		t.skinName = GameUiZuSkin$Skin4;
		return t;
	};
	_proto.homeBt_i = function () {
		var t = new eui.Button();
		this.homeBt = t;
		t.label = "";
		t.name = "homeBt";
		t.x = 609;
		t.y = 3;
		t.skinName = GameUiZuSkin$Skin5;
		return t;
	};
	_proto.soundBt_i = function () {
		var t = new eui.ToggleButton();
		this.soundBt = t;
		t.name = "soundBt";
		t.x = 735;
		t.y = 5;
		t.skinName = GameUiZuSkin$Skin6;
		return t;
	};
	_proto.jtshangBt_i = function () {
		var t = new eui.Button();
		this.jtshangBt = t;
		t.label = "";
		t.name = "jtshangBt";
		t.x = 198;
		t.y = 446;
		t.skinName = GameUiZuSkin$Skin7;
		return t;
	};
	_proto.tiqiuBt_i = function () {
		var t = new eui.Button();
		this.tiqiuBt = t;
		t.label = "";
		t.name = "tiqiuBt";
		t.x = 276;
		t.y = 446;
		t.skinName = GameUiZuSkin$Skin8;
		return t;
	};
	_proto.jtyouBt_i = function () {
		var t = new eui.Button();
		this.jtyouBt = t;
		t.label = "";
		t.name = "jtyouBt";
		t.x = 570.5;
		t.y = 446;
		t.skinName = GameUiZuSkin$Skin9;
		return t;
	};
	_proto.jtzuoBt_i = function () {
		var t = new eui.Button();
		this.jtzuoBt = t;
		t.label = "";
		t.name = "jtzuoBt";
		t.x = 496;
		t.y = 446;
		t.skinName = GameUiZuSkin$Skin10;
		return t;
	};
	_proto._textbifen1_i = function () {
		var t = new eui.Label();
		this._textbifen1 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "方正综艺简体";
		t.height = 30;
		t.size = 30;
		t.text = "30";
		t.textAlign = "right";
		t.textColor = 0xe5e5e5;
		t.width = 42;
		t.x = 364;
		t.y = 460;
		return t;
	};
	_proto._textbifen2_i = function () {
		var t = new eui.Label();
		this._textbifen2 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "方正综艺简体";
		t.height = 30;
		t.size = 30;
		t.text = "30";
		t.textAlign = "left";
		t.textColor = 0xE5E5E5;
		t.width = 42;
		t.x = 421;
		t.y = 459;
		return t;
	};
	_proto.MathGames_i = function () {
		var t = new eui.Image();
		this.MathGames = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 37;
		t.name = "MathGames";
		t.source = "./resource/assets/games/42.png";
		t.width = 119;
		t.x = 340.5;
		t.y = 7.5;
		return t;
	};
	return GameUiZuSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HScrollBarSkin.exml'] = window.skins.HScrollBarSkin = (function (_super) {
	__extends(HScrollBarSkin, _super);
	function HScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = HScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 8;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.verticalCenter = 0;
		t.width = 30;
		return t;
	};
	return HScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HSliderSkin.exml'] = window.skins.HSliderSkin = (function (_super) {
	__extends(HSliderSkin, _super);
	function HSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = HSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.height = 6;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_sb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.source = "thumb_png";
		t.verticalCenter = 0;
		return t;
	};
	return HSliderSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ItemRendererSkin.exml'] = window.skins.ItemRendererSkin = (function (_super) {
	__extends(ItemRendererSkin, _super);
	function ItemRendererSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
		
		eui.Binding.$bindProperties(this, ["hostComponent.data"],[0],this.labelDisplay,"text");
	}
	var _proto = ItemRendererSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.fontFamily = "Tahoma";
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	return ItemRendererSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/PanelSkin.exml'] = window.skins.PanelSkin = (function (_super) {
	__extends(PanelSkin, _super);
	function PanelSkin() {
		_super.call(this);
		this.skinParts = ["titleDisplay","moveArea","closeButton"];
		
		this.minHeight = 230;
		this.minWidth = 450;
		this.elementsContent = [this._Image1_i(),this.moveArea_i(),this.closeButton_i()];
	}
	var _proto = PanelSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.scale9Grid = new egret.Rectangle(2,2,12,12);
		t.source = "border_png";
		t.top = 0;
		return t;
	};
	_proto.moveArea_i = function () {
		var t = new eui.Group();
		this.moveArea = t;
		t.height = 45;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.elementsContent = [this._Image2_i(),this.titleDisplay_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "header_png";
		t.top = 0;
		return t;
	};
	_proto.titleDisplay_i = function () {
		var t = new eui.Label();
		this.titleDisplay = t;
		t.fontFamily = "Tahoma";
		t.left = 15;
		t.right = 5;
		t.size = 20;
		t.textColor = 0xFFFFFF;
		t.verticalCenter = 0;
		t.wordWrap = false;
		return t;
	};
	_proto.closeButton_i = function () {
		var t = new eui.Button();
		this.closeButton = t;
		t.bottom = 5;
		t.horizontalCenter = 0;
		t.label = "close";
		return t;
	};
	return PanelSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ProgressBarSkin.exml'] = window.skins.ProgressBarSkin = (function (_super) {
	__extends(ProgressBarSkin, _super);
	function ProgressBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb","labelDisplay"];
		
		this.minHeight = 18;
		this.minWidth = 30;
		this.elementsContent = [this._Image1_i(),this.thumb_i(),this.labelDisplay_i()];
	}
	var _proto = ProgressBarSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_pb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.percentHeight = 100;
		t.source = "thumb_pb_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = 0;
		t.size = 15;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		return t;
	};
	return ProgressBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/RadioButtonSkin.exml'] = window.skins.RadioButtonSkin = (function (_super) {
	__extends(RadioButtonSkin, _super);
	function RadioButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_disabled_png")
				])
		];
	}
	var _proto = RadioButtonSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "radiobutton_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return RadioButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ScrollerSkin.exml'] = window.skins.ScrollerSkin = (function (_super) {
	__extends(ScrollerSkin, _super);
	function ScrollerSkin() {
		_super.call(this);
		this.skinParts = ["horizontalScrollBar","verticalScrollBar"];
		
		this.minHeight = 20;
		this.minWidth = 20;
		this.elementsContent = [this.horizontalScrollBar_i(),this.verticalScrollBar_i()];
	}
	var _proto = ScrollerSkin.prototype;

	_proto.horizontalScrollBar_i = function () {
		var t = new eui.HScrollBar();
		this.horizontalScrollBar = t;
		t.bottom = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.verticalScrollBar_i = function () {
		var t = new eui.VScrollBar();
		this.verticalScrollBar = t;
		t.percentHeight = 100;
		t.right = 0;
		return t;
	};
	return ScrollerSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/shop.exml'] = window.shopSkin = (function (_super) {
	__extends(shopSkin, _super);
	function shopSkin() {
		_super.call(this);
		this.skinParts = ["wujinbi","wushu","zongjinbi","shuotext","gouBn","gouhuiBn","gaoBn","fanhuiBn","shopzu","gaobiBn","gaozu"];
		
		this.height = 500;
		this.width = 800;
		this.elementsContent = [this.shopzu_i(),this.gaozu_i()];
	}
	var _proto = shopSkin.prototype;

	_proto.shopzu_i = function () {
		var t = new eui.Group();
		this.shopzu = t;
		t.x = 0;
		t.y = 0;
		t.elementsContent = [this._Image1_i(),this.wujinbi_i(),this.wushu_i(),this.zongjinbi_i(),this.shuotext_i(),this.gouBn_i(),this.gouhuiBn_i(),this.gaoBn_i(),this.fanhuiBn_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "shangBg_png";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.wujinbi_i = function () {
		var t = new eui.Label();
		this.wujinbi = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "方正琥珀_GBK";
		t.height = 28;
		t.size = 24;
		t.text = "3000";
		t.textAlign = "center";
		t.textColor = 0xffd723;
		t.width = 69;
		t.x = 213;
		t.y = 213;
		return t;
	};
	_proto.wushu_i = function () {
		var t = new eui.Label();
		this.wushu = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "方正琥珀_GBK";
		t.height = 28;
		t.size = 30;
		t.text = "30";
		t.textAlign = "center";
		t.textColor = 0xd668bd;
		t.width = 69;
		t.x = 181;
		t.y = 270.5;
		return t;
	};
	_proto.zongjinbi_i = function () {
		var t = new eui.Label();
		this.zongjinbi = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "方正琥珀_GBK";
		t.height = 29;
		t.size = 27;
		t.text = "3000";
		t.textAlign = "left";
		t.textColor = 0xffcc00;
		t.width = 101;
		t.x = 165;
		t.y = 104;
		return t;
	};
	_proto.shuotext_i = function () {
		var t = new eui.Label();
		this.shuotext = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bold = true;
		t.fontFamily = "SimHei";
		t.height = 106;
		t.size = 22;
		t.text = "这个道济";
		t.textColor = 0xff8a00;
		t.width = 249;
		t.x = 397;
		t.y = 178.5;
		return t;
	};
	_proto.gouBn_i = function () {
		var t = new eui.Image();
		this.gouBn = t;
		t.anchorOffsetX = 57.5;
		t.anchorOffsetY = 25.5;
		t.name = "gouBn";
		t.source = "gouBn_png";
		t.x = 213;
		t.y = 332.5;
		return t;
	};
	_proto.gouhuiBn_i = function () {
		var t = new eui.Image();
		this.gouhuiBn = t;
		t.anchorOffsetX = 57.5;
		t.anchorOffsetY = 25.5;
		t.name = "gouhuiBn";
		t.source = "gouhuiBn_png";
		t.x = 213;
		t.y = 331.5;
		return t;
	};
	_proto.gaoBn_i = function () {
		var t = new eui.Image();
		this.gaoBn = t;
		t.anchorOffsetX = 99;
		t.anchorOffsetY = 32;
		t.name = "gaoBn";
		t.source = "gaoBn_png";
		t.x = 221;
		t.y = 409;
		return t;
	};
	_proto.fanhuiBn_i = function () {
		var t = new eui.Image();
		this.fanhuiBn = t;
		t.anchorOffsetX = 30.5;
		t.anchorOffsetY = 21;
		t.name = "fanhuiBn";
		t.source = "fanhuiBn_png";
		t.x = 650.5;
		t.y = 390.5;
		return t;
	};
	_proto.gaozu_i = function () {
		var t = new eui.Group();
		this.gaozu = t;
		t.visible = false;
		t.x = 2;
		t.y = 0;
		t.elementsContent = [this._Image2_i(),this.gaobiBn_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.source = "gaoBg_png";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.gaobiBn_i = function () {
		var t = new eui.Image();
		this.gaobiBn = t;
		t.anchorOffsetX = 17;
		t.anchorOffsetY = 17;
		t.name = "gaobiBn";
		t.source = "gaobiBn_png";
		t.x = 643;
		t.y = 142;
		return t;
	};
	return shopSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ShouYeSkin.exml'] = window.ShouYeSkin = (function (_super) {
	__extends(ShouYeSkin, _super);
	var ShouYeSkin$Skin11 = 	(function (_super) {
		__extends(ShouYeSkin$Skin11, _super);
		function ShouYeSkin$Skin11() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","1VAI2_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = ShouYeSkin$Skin11.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "1VAI1_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return ShouYeSkin$Skin11;
	})(eui.Skin);

	var ShouYeSkin$Skin12 = 	(function (_super) {
		__extends(ShouYeSkin$Skin12, _super);
		function ShouYeSkin$Skin12() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","1V12_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = ShouYeSkin$Skin12.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "1V11_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return ShouYeSkin$Skin12;
	})(eui.Skin);

	function ShouYeSkin() {
		_super.call(this);
		this.skinParts = ["gamebg","morebn","kaishiyouxi","MathGameslogo","role4","role3","role2","role1","VsAIBt","VsWanJiaBt","startBt","nandugroup","MathGames"];
		
		this.height = 500;
		this.width = 800;
		this.elementsContent = [this.gamebg_i(),this.morebn_i(),this.kaishiyouxi_i(),this.nandugroup_i(),this.MathGames_i()];
	}
	var _proto = ShouYeSkin.prototype;

	_proto.gamebg_i = function () {
		var t = new eui.Image();
		this.gamebg = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 500;
		t.source = "gamebg_png";
		t.width = 800;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.morebn_i = function () {
		var t = new eui.Image();
		this.morebn = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 57.3;
		t.name = "morebn";
		t.source = "./resource/assets/games/morebn.png";
		t.width = 74.5;
		t.x = 505;
		t.y = 347.65;
		return t;
	};
	_proto.kaishiyouxi_i = function () {
		var t = new eui.Image();
		this.kaishiyouxi = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 57.3;
		t.name = "kaishiyouxi";
		t.source = "./resource/assets/games/kaishibn.png";
		t.width = 74.5;
		t.x = 622;
		t.y = 347.65;
		return t;
	};
	_proto.nandugroup_i = function () {
		var t = new eui.Group();
		this.nandugroup = t;
		t.height = 500;
		t.width = 800;
		t.x = 800;
		t.y = 0;
		t.elementsContent = [this._Image1_i(),this.MathGameslogo_i(),this.role4_i(),this.role3_i(),this.role2_i(),this.role1_i(),this.VsAIBt_i(),this.VsWanJiaBt_i(),this.startBt_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 500;
		t.source = "./resource/assets/games/gatebg.png";
		t.width = 800;
		t.x = 0;
		t.y = -1;
		return t;
	};
	_proto.MathGameslogo_i = function () {
		var t = new eui.Image();
		this.MathGameslogo = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 44;
		t.name = "MathGameslogo";
		t.source = "./resource/assets/games/52.png";
		t.width = 149;
		t.x = 325.52;
		t.y = 424.91;
		return t;
	};
	_proto.role4_i = function () {
		var t = new eui.Image();
		this.role4 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 119;
		t.name = "role4";
		t.source = "./resource/assets/games/role4png.png";
		t.width = 50;
		t.x = 476;
		t.y = 190.5;
		return t;
	};
	_proto.role3_i = function () {
		var t = new eui.Image();
		this.role3 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 119;
		t.name = "role3";
		t.source = "./resource/assets/games/role3png.png";
		t.width = 45;
		t.x = 397;
		t.y = 192.5;
		return t;
	};
	_proto.role2_i = function () {
		var t = new eui.Image();
		this.role2 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 119;
		t.name = "role2";
		t.source = "./resource/assets/games/role2png.png";
		t.width = 45;
		t.x = 314;
		t.y = 189.5;
		return t;
	};
	_proto.role1_i = function () {
		var t = new eui.Image();
		this.role1 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 119;
		t.name = "role1";
		t.source = "./resource/assets/games/role1png.png";
		t.width = 45;
		t.x = 237;
		t.y = 190.5;
		return t;
	};
	_proto.VsAIBt_i = function () {
		var t = new eui.ToggleButton();
		this.VsAIBt = t;
		t.label = "";
		t.name = "VsAIBt";
		t.x = 218.5;
		t.y = 119;
		t.skinName = ShouYeSkin$Skin11;
		return t;
	};
	_proto.VsWanJiaBt_i = function () {
		var t = new eui.ToggleButton();
		this.VsWanJiaBt = t;
		t.label = "";
		t.name = "VsWanJiaBt";
		t.x = 453;
		t.y = 119;
		t.skinName = ShouYeSkin$Skin12;
		return t;
	};
	_proto.startBt_i = function () {
		var t = new eui.Image();
		this.startBt = t;
		t.height = 53;
		t.name = "startBt";
		t.source = "";
		t.width = 202;
		t.x = 296;
		t.y = 339.65;
		return t;
	};
	_proto.MathGames_i = function () {
		var t = new eui.Image();
		this.MathGames = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 44;
		t.name = "MathGames";
		t.source = "./resource/assets/games/52.png";
		t.width = 149;
		t.x = 518.25;
		t.y = 442;
		return t;
	};
	return ShouYeSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/TextInputSkin.exml'] = window.skins.TextInputSkin = (function (_super) {
	__extends(TextInputSkin, _super);
	function TextInputSkin() {
		_super.call(this);
		this.skinParts = ["textDisplay","promptDisplay"];
		
		this.minHeight = 40;
		this.minWidth = 300;
		this.elementsContent = [this._Image1_i(),this._Rect1_i(),this.textDisplay_i()];
		this.promptDisplay_i();
		
		this.states = [
			new eui.State ("normal",
				[
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("textDisplay","textColor",0xff0000)
				])
			,
			new eui.State ("normalWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
			,
			new eui.State ("disabledWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
		];
	}
	var _proto = TextInputSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.fillColor = 0xffffff;
		t.percentHeight = 100;
		t.percentWidth = 100;
		return t;
	};
	_proto.textDisplay_i = function () {
		var t = new eui.EditableText();
		this.textDisplay = t;
		t.height = 24;
		t.left = "10";
		t.right = "10";
		t.size = 20;
		t.textColor = 0x000000;
		t.verticalCenter = "0";
		t.percentWidth = 100;
		return t;
	};
	_proto.promptDisplay_i = function () {
		var t = new eui.Label();
		this.promptDisplay = t;
		t.height = 24;
		t.left = 10;
		t.right = 10;
		t.size = 20;
		t.textColor = 0xa9a9a9;
		t.touchEnabled = false;
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	return TextInputSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ToggleSwitchSkin.exml'] = window.skins.ToggleSwitchSkin = (function (_super) {
	__extends(ToggleSwitchSkin, _super);
	function ToggleSwitchSkin() {
		_super.call(this);
		this.skinParts = [];
		
		this.elementsContent = [this._Image1_i(),this._Image2_i()];
		this.states = [
			new eui.State ("up",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
		];
	}
	var _proto = ToggleSwitchSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "on_png";
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		this._Image2 = t;
		t.horizontalCenter = -18;
		t.source = "handle_png";
		t.verticalCenter = 0;
		return t;
	};
	return ToggleSwitchSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VScrollBarSkin.exml'] = window.skins.VScrollBarSkin = (function (_super) {
	__extends(VScrollBarSkin, _super);
	function VScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 20;
		this.minWidth = 8;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = VScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 30;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.width = 8;
		return t;
	};
	return VScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VSliderSkin.exml'] = window.skins.VSliderSkin = (function (_super) {
	__extends(VSliderSkin, _super);
	function VSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 30;
		this.minWidth = 25;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = VSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.percentHeight = 100;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_png";
		t.width = 7;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.horizontalCenter = 0;
		t.source = "thumb_png";
		return t;
	};
	return VSliderSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/YaoGan.exml'] = window.YaoGanSkin = (function (_super) {
	__extends(YaoGanSkin, _super);
	function YaoGanSkin() {
		_super.call(this);
		this.skinParts = ["circle","ball"];
		
		this.elementsContent = [this.circle_i(),this.ball_i()];
	}
	var _proto = YaoGanSkin.prototype;

	_proto.circle_i = function () {
		var t = new eui.Image();
		this.circle = t;
		t.anchorOffsetX = 75;
		t.anchorOffsetY = 75;
		t.source = "yg_quan_png";
		t.x = 75;
		t.y = 75;
		return t;
	};
	_proto.ball_i = function () {
		var t = new eui.Image();
		this.ball = t;
		t.anchorOffsetX = 19;
		t.anchorOffsetY = 19;
		t.source = "yg_zhongxin_png";
		t.x = 75;
		t.y = 75;
		return t;
	};
	return YaoGanSkin;
})(eui.Skin);