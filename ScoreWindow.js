//=============================================================================
// ScoreWindow.js
//=============================================================================
/*:
* @plugindesc Queres pôr um sistema de pontuação no teu projecto?
* 
*
* @author Márcio Eduine | mechaprogra
*
* @help
*
* Bem, o que este plugin faz é mostrar o valor armazenado numa
* determinada variável e apresentá-lo na janela de puntuação.
*
* TERMS OF USE
*
* - Uso comercial:
* - Uso não-comercial;
* - Mencionar os autores nos créditos do projecto.
*
* ---Params---
* 
* @param show
* @desc Mostrar
*  1 - Mostrar, 0 - Ocultar
* @default 0
*
* @param scoreVariable
* @desc variável onde se armazena a pontuação
* @default 1
*
* ---Plugin Commands---
*
*   scoreWindow show		# Mostra a janela de pontuação.
*   scoreWindow hidden		# Oculta a janela de pontuação.
*
*/

(function() {

    var parameters = PluginManager.parameters('scoreWindow');
	var show = Number(parameters['show'] || 0);
    var scoreVariable = Number(parameters['scoreVariable'] || 1);

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command === 'scoreWindow') {
            switch(args[0])
			{
				case 'show':
					show = 1;
					break;
				case 'hidden':
					show = 0;
					break;
			}	
		}
	};

    function Window_MyWindow() {
        this.initialize.apply(this, arguments);
    }

    Window_MyWindow.prototype = Object.create(Window_Base.prototype);
    Window_MyWindow.prototype.constructor = Window_MyWindow;

    Window_MyWindow.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };

    Window_MyWindow.prototype.refresh = function() {
        this.contents.clear();
        this.drawScore();
    };

    Window_MyWindow.prototype.drawScore = function() {
        this.drawText("Pontuação: " + $gameVariables.value(scoreVariable), 0, 0, this.contentsWidth(), this.lineHeight());
    };

    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);        
    };

    Scene_Map.prototype.createMinimapWindow = function() {
        if(!this._minimapWindow)
        {
            this._minimapWindow = new Window_MyWindow(5, 5, 200, 70);
        }        
        this._minimapWindow.refresh();
        this.addChild(this._minimapWindow);
    };

    Scene_Map.prototype.deleteMinimapWindow = function() {
        if(!this._minimapWindow)
        {
            this._minimapWindow = new Window_MyWindow(5, 5, 200, 70);
        }
        //this._minimapWindow.contents.clear();
        this.removeChild(this._minimapWindow);
    };

    Scene_Map.prototype.update = function() {
        if(show === 1)
        {
            this.createMinimapWindow();
        }
        else
        {
            this.deleteMinimapWindow();
        }
        
        this.updateDestination();
        this.updateMainMultiply();
        if (this.isSceneChangeOk()) {
            this.updateScene();
        } else if (SceneManager.isNextScene(Scene_Battle)) {
            this.updateEncounterEffect();
        }
        this.updateWaitCount(); 

        Scene_Base.prototype.update.call(this);
    };
    

 })();
