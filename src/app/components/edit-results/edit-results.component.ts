import { NgForOf } from '@angular/common';
import { HttpContext } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs'

import { ProjectService } from '../../services/project.service';
import { ExchangeService } from '../../services/exchange.service';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-edit-results',
  standalone: true,
  imports: [NgForOf, MatToolbarModule],
  templateUrl: './edit-results.component.html',
  styleUrl: './edit-results.component.scss'
})
export class EditResultsComponent implements OnInit{
  
  myCan = <HTMLCanvasElement>document.getElementById("myCanvas");
  myCanOverlay = <HTMLCanvasElement>document.getElementById("overlay")

  myImg = <HTMLImageElement>document.getElementById("plan");

  canvWrap = <HTMLDivElement>document.getElementById("canvasWrapper");
  resButtons = <HTMLDivElement>document.getElementById("resultButtons");
  control = <HTMLDivElement>document.getElementById("controls");

  textInputDiv = <HTMLDivElement>document.getElementById("textInputDiv");
  textInput = <HTMLInputElement>document.getElementById("textInput");
  textInputHoverDiv = <HTMLDivElement>document.getElementById("textInputHoveringDiv");
  textInputHover = <HTMLInputElement>document.getElementById("textInputHover");
  nextStepDisplayDiv = <HTMLDivElement>document.getElementById("nextStepDisplayDiv");
  nextStepDisplay = <HTMLLabelElement>document.getElementById("nextStepDisplay");
  editSelectionDiv = <HTMLDivElement>document.getElementById("editSelectionDiv");
  newTextControlDiv = <HTMLDivElement>document.getElementById("newTextControlDiv");
  editBoxControlDiv = <HTMLDivElement>document.getElementById("editBoxControlDiv");
  confirmDiv = <HTMLDivElement>document.getElementById("confirmDiv");

  // Required variables and calculations
  // numbers

  imgRatio: number = 0; 
  imgCanRatio: number = 0;

  selectedID = -1;

  startX: number = 0;
  startY: number = 0;

  prevStartX: number = 0;
  prevStartY: number = 0;

  prevWidth: number  = 0;
  prevHeight: number = 0;

  newButtonX: number = 0;
  newButtonY: number = 0;
  newButtonW: number = 0;
  newButtonH: number = 0;

  offsetX: number = 0;
  offsetY: number = 0;

  imageWidth: number = 0;
  imageHeigth: number = 0;

  nativeImageWidth: number = 0;
  nativeImageHeigth: number = 0;

  // booleans
  textEdit: boolean = false;

  newMode: boolean = false;
  editMode: boolean = false;
  deleteMode: boolean = false;

  newTextboxFlag: boolean = false;
  textInputFlag: boolean = false;
  boxEditFlag: boolean = false;

  mouseIsDown: boolean = false;

  // others
  imageSource: string = "";

  bbArray: any[] = [];

  styles: string[] = [];
  tooltipStyles: string[] = [];

  constructor(private router: Router,
              private exchange: ExchangeService,
              private projectService: ProjectService
            ){}

  // Setup Functions - used for setting up the page and its contents

  /*
    general setup function, triggered upon image load, 
    loads results,  initiates positioning of results on cancas,
      calculates required values and sets canvas size
  */
  setup()
  {
    this.nativeImageWidth = this.myImg.naturalWidth;
    this.nativeImageHeigth = this.myImg.naturalHeight;

    this.imageWidth = this.nativeImageWidth;
    this.imageHeigth = this.nativeImageHeigth;

    this.imgRatio = this.nativeImageWidth/this.nativeImageHeigth;

    //Load Results
    this.bbArray = this.exchange.getResult();

    //Size Canvas
    if(window.innerWidth < 800)
    {
      this.sizeCanvasVert(this.imgRatio);
    }
    else
    {
      this.sizeCanvas(this.imgRatio);
    }               
    
    this.imgCanRatio = this.myCan.width / this.nativeImageWidth;

    //Initial calculation of positions
    this.calcPositions();
  }

  /*
    Wrapper function - allows for all positions to be adjusted at once 
  */
  adjustPositions()
  {
    this.imgCanRatio = this.myCan.width / this.nativeImageWidth;

    for(var i: number = 0; i < this.styles.length; i++)
    {
      this.adjustSinglePosition(i);
    }
  }

  /*
    Function used to calculate the positions of results and the hover displays 
  */
  adjustSinglePosition(id: number)
  {
    var topOffset: number = Math.ceil(<any>this.bbArray[id][1] * this.imgCanRatio);
    var leftOffset: number = Math.ceil(<any>this.bbArray[id][0] * this.imgCanRatio);
    var width: number = Math.ceil(<any>this.bbArray[id][2] * this.imgCanRatio) + 2;
    var height: number = Math.ceil(<any>this.bbArray[id][3] * this.imgCanRatio) + 2;

    var leftTooltipOffset: number = 0;
    var topTooltipOffset: number = 0;
    var tooltipWidth: number = (10 + 10 * this.bbArray[id][4].toString().length);

    if(height > 20)
    {
      topTooltipOffset = (Math.ceil(height / 2) - 12);
    }
    else
    {
      if(topOffset <= Math.floor(this.myCan.height * this.imgCanRatio  * 0.5))
      {
        topTooltipOffset = 0;
      }
      else
      {
        topTooltipOffset = (height - 30);
      }
    }
    if((leftOffset + width) <= Math.floor(this.myImg.width * 0.5))
    {
      leftTooltipOffset = (width + 5);
    }
    else
    {
      leftTooltipOffset = ((tooltipWidth * -1) - 10);
    }

    this.styles[id] = "top: "+topOffset+"px;"+
                      "left: "+leftOffset+"px;"+
                      "width: "+width+"px;"+
                      "height: "+height+"px;"; 

    this.tooltipStyles[id] = "top: "+topTooltipOffset+"px;"+
                             "left: "+leftTooltipOffset+"px;"+
                             "width: "+tooltipWidth+"px;"+
                             "height: 20px;";
  }

  /*
    Calculates the initial positioning of the results and hover displays
  */
  calcPositions()
  {
    for(var i: number = 0; i < this.bbArray.length; i++)
    {
      var topOffset: number = Math.ceil(<any>this.bbArray[i][1] * this.imgCanRatio);
      var leftOffset: number = Math.ceil(<any>this.bbArray[i][0] * this.imgCanRatio);
      var width: number = Math.ceil(<any>this.bbArray[i][2] * this.imgCanRatio) + 2;
      var height: number = Math.ceil(<any>this.bbArray[i][3] * this.imgCanRatio) + 2;

      var leftTooltipOffset: number = 0;
      var topTooltipOffset: number = 0;
      var tooltipWidth: number = (10 + 10 * this.bbArray[i][4].toString().length);

      if(height > 20)
      {
        topTooltipOffset = (Math.ceil(height / 2) - 12);
      }
      else
      {
        if(topOffset <= Math.floor(this.myCan.height * this.imgCanRatio  * 0.5))
        {
          topTooltipOffset = 0;
        }
        else
        {
          topTooltipOffset = (height - 30);
        }
      }

      if((leftOffset + width) <= Math.floor(this.myImg.width * 0.5))
      {
        leftTooltipOffset = (width + 5);
      }
      else
      {
        leftTooltipOffset = ((tooltipWidth * -1) - 10);
      }
        
      if(i >= this.styles.length)
      {
        this.styles.push("top: "+topOffset+"px;"+
                         "left: "+leftOffset+"px;"+
                         "width: "+width+"px;"+
                         "height: "+height+"px;");

        this.tooltipStyles.push("top: "+topTooltipOffset+"px;"+
                                "left: "+leftTooltipOffset+"px;"+
                                "width: "+tooltipWidth+"px;"+
                                "height: 20px;");
      }
      else
      {
        this.styles[i] = "top: "+topOffset+"px;"+
                         "left: "+leftOffset+"px;"+
                         "width: "+width+"px;"+
                         "height: "+height+"px;";

        this.tooltipStyles[i] = "top: "+topTooltipOffset+"px;"+
                                "left: "+leftTooltipOffset+"px;"+
                                "width: "+tooltipWidth+"px;"+
                                "height: 20px;";
      }
    }
  }
  
  /*
    Init function - Multiple uses: 
      - get html-elements
      - load the image
      - set up event listeners
  */
  ngOnInit(): void 
  {
    this.myCan = <HTMLCanvasElement>document.getElementById("myCanvas");
    this.myCanOverlay = <HTMLCanvasElement>document.getElementById("overlay");

    this.canvWrap = <HTMLDivElement>document.getElementById("canvasWrapper");
    this.resButtons = <HTMLDivElement>document.getElementById("resultButtons");
    this.control = <HTMLDivElement>document.getElementById("controls");

    this.myImg = <HTMLImageElement>document.getElementById("plan");

    this.textInputDiv = <HTMLDivElement>document.getElementById("textInputDiv");
    this.textInput = <HTMLInputElement>document.getElementById("textInput");
    this.textInputHoverDiv = <HTMLDivElement>document.getElementById("textInputHoveringDiv");
    this.textInputHover = <HTMLInputElement>document.getElementById("textInputHover");
    this.nextStepDisplayDiv = <HTMLDivElement>document.getElementById("nextStepDisplayDiv");
    this.nextStepDisplay = <HTMLLabelElement>document.getElementById("nextStepDisplay");
    this.editSelectionDiv = <HTMLDivElement>document.getElementById("editSelectionDiv");
    this.newTextControlDiv = <HTMLDivElement>document.getElementById("newTextControlDiv");
    this.editBoxControlDiv = <HTMLDivElement>document.getElementById("editBoxControlDiv");
    this.confirmDiv = <HTMLDivElement>document.getElementById("confirmDiv");
  
    if(this.myCan && this.myCanOverlay && this.canvWrap)
    {
      this.offsetY = this.myCan.offsetTop + this.canvWrap.offsetTop;
      this.offsetX = this.myCan.offsetLeft + this.canvWrap.offsetLeft;
    }

    //load the image
    this.imageSource =this.exchange.getURL();

    //Eventlisteners for Window Events
    window.addEventListener("load", e => 
    {
        this.handleLoad();
    });
    
    window.addEventListener("resize", e =>
    {
      this.handleResize();
    }
    );
    
    // The hotkey listener
    window.addEventListener("keyup", e =>
    {
      if(!this.newMode && !this.editMode && !this.deleteMode && !this.textInputFlag)
      {
        if(e.key === "n")
        {
          this.createNewText();
        }
        else if(e.key === "e")
        {
          if(this.selectedID != -1)
          {
            this.editSelect();
          }
        }
        else if(e.key === "Backspace" || e.key === "Delete")
        {
          if(this.selectedID != -1)
          {
            this.removeText();
          }
        }
        else{}
      }
      else if(this.editMode && !this.newMode && !this.deleteMode && !this.newTextboxFlag)
      {
        if(e.key === "b" && !this.textInputFlag)
        {
          this.editBox();
        }
        else if(e.key === "t" && !this.textInputFlag)
        {
          this.editText();
        }
        else if(e.key === "Enter" && !this.textInputFlag)
        {
          if(this.boxEditFlag)
          {
            this.saveEditedBox();
          }
          else
          {
            this.exitMode();
          }
        }
        else if(e.key === "Enter" && this.textInputFlag)
        {
          this.textInputSubmit();
        } 
      }
      else if(!this.editMode && this.newMode && !this.deleteMode && !this.newTextboxFlag)
      {
        if(!this.newTextboxFlag)
        {
          if(e.key === "b" && !this.textInputFlag)
          {
            this.editBox();
          }
          else if(e.key === "Enter" && !this.textInputFlag)
          {
            this.newTextNext();
          }
          else if(e.key === "Enter" && this.textInputFlag)
          {
            this.textInputSubmit();
          } 
          else if(e.key === "Escape" && !this.textInputFlag)
          {
            this.exitMode();
          }
        }
      }
      else if(!this.newMode && !this.editMode && this.deleteMode && !this.textInputFlag)
        {
          if(e.key === "Enter")
          {
            this.confirmDelete();
          }
          else if(e.key === "Escape")
          {
            this.denyDelete();
          }
          else{}
      }
  }
    );

    // Eventlisteners for mouse events on the canvas
    this.myCanOverlay.addEventListener("mousedown", e => 
    {
      this.control.style.display = "none";
      if(this.newTextboxFlag)
      {
        this.handleMouseDown(e);
      }
  
    });
  
    this.myCanOverlay.addEventListener("mousemove", e => 
    {
      if(this.newTextboxFlag)
      {
        this.handleMouseMove(e);
      }
    });
  
    this.myCanOverlay.addEventListener("mouseup", e => 
    {
      if(this.newTextboxFlag)
      {
        this.handleMouseUp(e);
      }
    });
  
    this.myCanOverlay.addEventListener("mouseout", e =>
    {
      if(this.newTextboxFlag)
      {
        this.handleMouseOut(e);
      }
    });
  
    this.myCanOverlay.addEventListener("contextmenu", e =>
    {
      this.handleContextMenu(e);
    });    
  }

  /*
    Sizing function - used for screens above 800px width 
  */
  sizeCanvas(ratio: number)
  {
    var maxWidth: number = window.innerWidth - 200;
    var maxHeigth: number = window.innerHeight - 150;

    if(ratio > 1 && (maxWidth < Math.floor(maxHeigth * ratio)))
    {
      this.myCan.width = maxWidth;
      this.myCan.height = maxWidth / ratio;

      this.myCanOverlay.width = this.myCan.width;
      this.canvWrap.style.width = this.myCan.width + "px";

      this.myCanOverlay.height = this.myCan.height;
      this.canvWrap.style.height = this.myCan.height + "px";
      this.resButtons.style.height = window.innerHeight - 150 + "px";
    }
    else if(ratio > 1 && (maxWidth >= Math.floor(maxHeigth * ratio)))
    {
      this.myCan.height = maxHeigth;
      this.myCan.width = maxHeigth * ratio;
  
      this.myCanOverlay.width = this.myCan.width;
      this.canvWrap.style.width = this.myCan.width + "px";
  
      this.myCanOverlay.height = this.myCan.height;
      this.canvWrap.style.height = this.myCan.height + "px";
      this.resButtons.style.height = window.innerHeight - 150 + "px";
    }
    else if(ratio < 1 && (maxWidth < Math.floor(maxHeigth * ratio)))
    {
      this.myCan.width = maxWidth;
      this.myCan.height = maxWidth / ratio;

      this.myCanOverlay.width = this.myCan.width;
      this.canvWrap.style.width = this.myCan.width + "px";

      this.myCanOverlay.height = this.myCan.height;
      this.canvWrap.style.height = this.myCan.height + "px";
      this.resButtons.style.height = window.innerHeight - 150 + "px";
    }
    else if(ratio < 1 && (maxWidth >= Math.floor(maxHeigth * ratio)))
    {
      this.myCan.height = maxHeigth;
      this.myCan.width = maxHeigth * ratio;
  
      this.myCanOverlay.width = this.myCan.width;
      this.canvWrap.style.width = this.myCan.width + "px";
  
      this.myCanOverlay.height = this.myCan.height;
      this.canvWrap.style.height = this.myCan.height + "px";
      this.resButtons.style.height = window.innerHeight - 150 + "px";  
    }
    else
    {
      this.myCan.width = Math.min(maxHeigth, maxWidth);
      this.myCan.height = this.myCan.width;

      this.myCanOverlay.width = this.myCan.width;
      this.canvWrap.style.width = this.myCan.width + "px";

      this.myCanOverlay.height = this.myCan.height;
      this.canvWrap.style.height = this.myCan.height + "px";
      this.resButtons.style.height = window.innerHeight - 150 + "px";
    }
    this.imageWidth = this.myCan.width;
    this.imageHeigth = this.myCan.height;
  }

  /*
    Sizing function - used for screens below 800px width 
  */
  sizeCanvasVert(ratio: number)
  {
    this.myCan.width = window.innerWidth * 0.95;
    this.myCanOverlay.width = this.myCan.width;
    this.canvWrap.style.width = this.myCan.width + "px";
    
    this.myCan.height = this.myCan.width / ratio;
    this.myCanOverlay.height = this.myCan.height;
    this.canvWrap.style.height = this.myCan.height + "px";
    
    this.resButtons.style.height = "70px";
  }
  
  // Functionality Functions - provide required functions, without being directly interactive
   
  createNewButton(id: number)
  {
    var leftOffset: number = 0;
    var topOffset: number = 0;
    var buttonWidth: number = 0;
    var buttonHeigth: number = 0;

    if(this.imgCanRatio >= 1)
    {
        leftOffset = Math.floor(<number>this.bbArray[id][0]);
        topOffset = Math.floor(<number>this.bbArray[id][1]);
        buttonWidth = Math.ceil(<number>this.bbArray[id][2]);
        buttonHeigth = Math.ceil(<number>this.bbArray[id][3]);
    }
    else
    {
        leftOffset = Math.floor(<number>this.bbArray[id][0] * this.imgCanRatio);
        topOffset = Math.floor(<number>this.bbArray[id][1] * this.imgCanRatio);
        buttonWidth = Math.ceil(<number>this.bbArray[id][2] * this.imgCanRatio);
        buttonHeigth = Math.ceil(<number>this.bbArray[id][3] * this.imgCanRatio);
    }

    var leftTooltipOffset: number = 0;
    var topTooltipOffset: number = 0;
    var tooltipWidth: number = (10 + 10 * this.bbArray[id][4].toString().length);

    if(buttonHeigth > 20)
      {
          topTooltipOffset = (Math.ceil(buttonHeigth / 2) - 12);
      }
      else
      {
          if(topOffset <= Math.floor(this.myCan.height * this.imgCanRatio  * 0.5))
          {
              topTooltipOffset = 0;
          }
          else
          {
              topTooltipOffset = (buttonHeigth - 30);
          }
      }
  
      if((leftOffset + buttonWidth) <= Math.floor(this.myImg.width * this.imgCanRatio * 0.5))
      {
          leftTooltipOffset = (buttonWidth + 5);
      }
      else
      {
          leftTooltipOffset = ((tooltipWidth * -1) - 10);
      }

    this.styles.push("top: "+topOffset+"px;"+
      "left: "+leftOffset+"px;"+
      "width: "+buttonWidth+"px;"+
      "height: "+buttonHeigth+"px;");

    this.tooltipStyles.push("top: "+topTooltipOffset+"px;"+
      "left: "+leftTooltipOffset+"px;"+
      "width: "+tooltipWidth+"px;"+
      "height: 20px;");
  }

  clickOnResult(id: number)
  {
    if(!this.newMode)
    {
        if((id-1) !== this.selectedID)
        {
          this.control.style.display = "none";

            if(this.editMode)
            {
              this.textInputDiv.style.display = "none";
              this.textInput.value = "";
              this.editSelectionDiv.style.display = "none";
              this.editBoxControlDiv.style.display = "none";
              this.nextStepDisplayDiv.style.display = "block";


              this.editMode = false;
              this.textInputFlag = false;
            }

            if(this.selectedID !== -1)
            {
              var curElement = <HTMLButtonElement>document.getElementById("result"+(this.selectedID+1));
              var curResultListElement = <HTMLButtonElement>document.getElementById("result"+(this.selectedID+1)+"Button");
              if(curElement && curResultListElement)
              {
                curElement.classList.replace("activeResult", "result");
                curResultListElement.classList.remove("active");
              }
            }
            this.selectedID = id - 1;

            var selElement = <HTMLButtonElement>document.getElementById("result"+(id));
            var selResultListElement = <HTMLButtonElement>document.getElementById("result"+(id)+"Button");
            if(selElement && selResultListElement)
            {
              selElement.classList.replace("result", "activeResult");
              selResultListElement.classList.add("active");
            }
        }
        else
        {
            var selElem = <HTMLButtonElement>document.getElementById("result"+id);
            if(parseInt(selElem.style.top) <= (window.innerHeight * 0.5))
            {
                this.control.style.top = (parseInt(selElem.style.top) + parseInt(selElem.style.height) + 2) + "px";
            }
            else
            {
              this.control.style.top = (parseInt(selElem.style.top) - 26) + "px";
            }

            if(parseInt(selElem.style.left) <= (window.innerWidth * 0.5))
            {
              this.control.style.left = selElem.style.left;
            }
            else
            {
              this.control.style.left = (parseInt(selElem.style.left) - 150) + "px";
            }
            
            this.control.style.display="inline-block";
        }
    }
  }

  // Control Functions - Used by the control Buttons of the UI

  /* 
    function used for the addText button, initializes creation of a new text area
    used by rightclick & hotkey listener and addtext button
  */
  createNewText()
  {
    if(!this.newMode)
    {
      if(this.editMode)
      {
          this.editMode = false;

          this.textInputDiv.style.display = "none";
          this.editSelectionDiv.style.display = "none";
          this.editBoxControlDiv.style.display = "none";
      }

      this.newMode = true;
      this.newTextboxFlag = true;

      this.control.style.display = "none";
      this.nextStepDisplay.innerHTML = "Bitte Textbox einzeichnen";
    }
  }

  /*
     function used to advance in the craetion of a new text
     used by the "Weiter" button during creation of a new text
  */
  newTextNext()
  {
    if(this.newMode && !this.newTextboxFlag)
    {
      this.newTextControlDiv.style.display = "none";
      if(window.scrollY < 60)
      {
        this.textInputDiv.style.display = "inline-block";
        this.textInput.focus();
      }
      else
      {
          if(this.imgCanRatio < 1)
          {
              if(Math.floor(this.newButtonY + this.newButtonH) <= Math.floor(this.myCan.height * 0.75))
              {
                this.textInputHoverDiv.style.top = (Math.floor((this.newButtonY + this.newButtonH) * this.imgCanRatio) + 10) + "px";
              }
              else
              {
                this.textInputHoverDiv.style.top = (Math.floor(this.newButtonY * this.imgCanRatio) - 35) + "px";
              }

              if(Math.floor(this.newButtonX) <= (this.myCan.width - 400))
              {
                this.textInputHoverDiv.style.left = Math.floor(this.newButtonX * this.imgCanRatio) + "px";
              }
              else
              {
                this.textInputHoverDiv.style.left = (Math.floor((this.newButtonX + this.newButtonW) * this.imgCanRatio) - 300) + "px";
              }
          }
          else
          {
              if(Math.floor(this.newButtonY + this.newButtonH) <= (this.myCan.height * 0.75))
              {
                this.textInputHoverDiv.style.top = (Math.floor((this.newButtonY + this.newButtonH)) + 10) + "px";
              }
              else
              {
                this.textInputHoverDiv.style.top = (Math.floor(this.newButtonY) - 35) + "px";
              }
              if(Math.floor(this.newButtonX) <= (this.myCan.width - 400))
              {
                this.textInputHoverDiv.style.left = Math.floor(this.newButtonX) + "px";
              }
              else
              {
                this.textInputHoverDiv.style.left = (Math.floor(this.newButtonX + this.newButtonW) - 300) + "px";
              }
          }
          this.textInputHoverDiv.style.display = "block";
          this.textInputHover.focus();
      }
      this.textInputFlag = true;
      
      var addText = <HTMLButtonElement>document.getElementById("addText")
      addText.disabled = true;
      for(var i: number = 1; i <= this.bbArray.length; i++)
      {
        var curResult = <HTMLButtonElement>document.getElementById("result"+i);
        var curResultButton = <HTMLButtonElement>document.getElementById("result"+i+"Button");
        if(curResult && curResultButton)
        {
          curResult.disabled = true;
          curResultButton.disabled = true;
        }
      }
    }
  }

  /*
     function used to submit the input text
     used by the "Submit" button and hotkey listener when editing or submitting a new text
  */
  textInputSubmit()
  {
    if(window.scrollY < 60)
    {
      var text = this.textInput.value;
    }
    else
    {
      var text = this.textInputHover.value;
    }
    if(text === "" || text === null)
    {

    }
    else
    {
      if(this.editMode)
      {
          if(text === this.bbArray[this.selectedID][4])
          {
              
          }
          else
          {
            this.bbArray[this.selectedID][4] = text;
        //    var curResultText = <HTMLSpanElement>document.getElementById("resultText"+(this.selectedID+1));
            var curResultButton = <HTMLButtonElement>document.getElementById("result"+(this.selectedID+1)+"Button");
        //    curResultText.innerHTML = <string>this.bbArray[this.selectedID][4];
            curResultButton.innerHTML = <string>this.bbArray[this.selectedID][4];
          }

          this.textInputDiv.style.display = "none";
          this.textInputHoverDiv.style.display = "none";
          this.nextStepDisplayDiv.style.display = "block";
          this.nextStepDisplay.innerHTML = "Warte auf Eingabe" 
          this.editMode = false;
          this.textInputFlag = false;
      }
      else if(this.newMode)
      {
        this.selectedID = this.bbArray.length;
        this.bbArray.push([this.newButtonX,this.newButtonY,this.newButtonW,this.newButtonH,text,true]);
        this.createNewButton(this.selectedID);

        var addText = <HTMLButtonElement>document.getElementById("addText");
        addText.disabled = false;
        for(var i: number = 1; i < this.bbArray.length; i++)
        {
          var tempResult = <HTMLButtonElement>document.getElementById("result"+(i));
          var tempResultButton = <HTMLButtonElement>document.getElementById("result"+(i)+"Button");
          tempResult.disabled = false;
          tempResultButton.disabled = false;
        }

        var context = <CanvasRenderingContext2D>this.myCan.getContext("2d");
        if(context){context.clearRect(0, 0, this.myCan.width, this.myCan.height);}

        this.textInputDiv.style.display = "none";
        this.textInputHoverDiv.style.display = "none";
        this.nextStepDisplayDiv.style.display = "block";
        
        this.newMode = false;
        this.textInputFlag = false;
        this.selectedID = -1;
      }

      this.textInput.value = "";
      this.textInput.placeholder = "Neuer Text";

      this.textInputHover.value = "";
      this.textInputHover.placeholder = "Neuer Text";

    }
  }

  /*
    function used to open the edit selection to change bindig Box or alter Text
    used by the "Bearbeiten" button and hotkey listener
  */
  editSelect()
  {
    if(this.selectedID !== -1)
    {
      this.editMode = true;
      this.nextStepDisplayDiv.style.display = "none";
      this.editSelectionDiv.style.display = "inline-block";

      this.control.style.display = "none";
    }
  }

  /*
    function used to open the edit selection to change bindig Box or alter Text
    used by the "Bearbeiten" button and hotkey listener
  */
  editBox()
  {
    if(this.editMode && !this.newTextboxFlag)
    {
      var context = <CanvasRenderingContext2D>this.myCan.getContext("2d");
      if(context){context.clearRect(0, 0, this.myCan.width, this.myCan.height);}

      var curElement = <HTMLButtonElement>document.getElementById("result"+(this.selectedID+1));
      curElement.style.display = "none";

      this.editSelectionDiv.style.display = "none";
      this.nextStepDisplay.innerHTML = "Bitte Textbox einzeichnen";
      this.nextStepDisplayDiv.style.display = "block";

      // this.editBoxControlDiv.style.display = "inline-block";

      this.newTextboxFlag = true;
      this.boxEditFlag = true;
    }
    else if(this.newMode && !this.newTextboxFlag)
    {
      var context = <CanvasRenderingContext2D>this.myCan.getContext("2d");
      if(context){context.clearRect(0, 0, this.myCan.width, this.myCan.height);}

      
      this.newTextControlDiv.style.display = "none";
      this.nextStepDisplay.innerHTML = "Bitte textbox einzeichnen";
      this.nextStepDisplayDiv.style.display = "block";

      this.newTextboxFlag = true;
    }
  }

  /*
    function used to start editing the Textbox of the selected result
    used by the "Textbox Bearbeiten" button and hotkey listener
  */
  saveEditedBox()
  {
    var context = <CanvasRenderingContext2D>this.myCan.getContext("2d");
    if(context){context.clearRect(0, 0, this.myCan.width, this.myCan.height);}

    var addText = <HTMLButtonElement>document.getElementById("addText");
    addText.disabled = true;
    for(var i: number = 1; i <= this.bbArray.length; i++)
    {
      var tempResult = <HTMLButtonElement>document.getElementById("result"+i);
      var tempResultButton = <HTMLButtonElement>document.getElementById("result"+i+"Button");
      tempResult.disabled = true;
      tempResultButton.disabled = true;
    }

    this.bbArray[this.selectedID][0] = this.newButtonX;
    this.bbArray[this.selectedID][1] = this.newButtonY;
    this.bbArray[this.selectedID][2] = this.newButtonW;
    this.bbArray[this.selectedID][3] = this.newButtonH;

    this.adjustSinglePosition(this.selectedID);

    var x = <HTMLButtonElement>document.getElementById("result"+(this.selectedID+1));
    x.style.display = "block";

    addText.disabled = false;
    for(var i: number = 1; i <= this.bbArray.length; i++)
    {
      var tempResult = <HTMLButtonElement>document.getElementById("result"+i);
      var tempResultButton = <HTMLButtonElement>document.getElementById("result"+i+"Button");
      tempResult.disabled = false;
      tempResultButton.disabled = false;
    }

    this.boxEditFlag = false;

    this.editBoxControlDiv.style.display = "none";
    this.editSelectionDiv.style.display = "inline-block";
  }

  /*
    function used to start editing the text of the current result
    used by the "Text Bearbeiten" button and hotkey listener
  */
  editText()
  {
    if(this.editMode)
    {
      this.editSelectionDiv.style.display = "none";

        if(window.scrollY < 60)
        {
          this.textInputDiv.style.display = "inline-block";
          this.textInput.focus();
        }
        else
        {
          var selElem = <HTMLButtonElement>document.getElementById("result"+(this.selectedID+1));

          if((parseInt(selElem.style.top) + parseInt(selElem.style.height)) <= this.myCan.height * 0.75)
          {
            this.textInputHoverDiv.style.top = ((parseInt(selElem.style.top) + parseInt(selElem.style.height)) + 10) + "px";
          }
          else
          {
            this.textInputHoverDiv.style.top = (parseInt(selElem.style.top) - 35) + "px";
          }
          if(parseInt(selElem.style.left) <= this.myCan.width - 400)
          {
            this.textInputHoverDiv.style.left = parseInt(selElem.style.left) + "px";
          }
          else
          {
            this.textInputHoverDiv.style.left = ((parseInt(selElem.style.left) + parseInt(selElem.style.top)) - 300) + "px";
          }

          this.nextStepDisplayDiv.style.display = "block";
          this.nextStepDisplay.innerHTML = "Bitte erkannten Text eingeben.";

          this.textInputHoverDiv.style.display = "block";
          this.textInputHover.focus();
      }

      this.textInputFlag = true;

      this.textInput.placeholder = this.bbArray[this.selectedID][4].toString();

      this.control.style.display = "none";
    }
  }

  /*
    function used to initialite the deletion the currently selected result
    used by the "Entfernen" button and hotkey listener
  */
  removeText()
  {
    if(this.selectedID !== -1)
    {
      this.deleteMode = true;
      this.control.style.display = "none";

      this.nextStepDisplayDiv.style.display = "none";
      this.confirmDiv.style.display = "block";
    }
  }

  /*
    function used to delete the currently selected result
    used by the "JA" button of the confirmation and hotkey listener
  */
  confirmDelete()
  {
    if(this.selectedID !== -1 && this.deleteMode)
    {
      this.bbArray[this.selectedID][5] = false;
      var x = this.selectedID + 1;
      var delResult = <HTMLButtonElement>document.getElementById("result"+x);
      var delResultButton = <HTMLButtonElement>document.getElementById("result"+x+"Button");
      delResult.style.display = "none";
      delResultButton.style.display = "none";
      this.selectedID = -1;

      this.deleteMode = false;

      this.control.style.display = "none";

      this.confirmDiv.style.display = "none";
      this.nextStepDisplay.innerHTML = "Warte auf Eingabe";
      this.nextStepDisplayDiv.style.display = "block";
    }
  }

  /*
    function used to cancel the deletion the currently selected result
    used by the "NEIN" button of the confirmation and hotkey listener
  */
  denyDelete()
  {
    this.deleteMode = false;

    this.control.style.display = "none";
    this.confirmDiv.style.display = "none";
    this.nextStepDisplay.innerHTML = "Warte auf Eingabe";
    this.nextStepDisplayDiv.style.display = "block";
  }
  
  /*
    function used to allow exiting the current editing or creation of new textbox
    used by the "Beenden" button and hotkey listener
  */
  exitMode()
  {
    if(this.newMode)
    {
      this.newMode = false;
      this.newTextboxFlag = false;
      
      var context = <CanvasRenderingContext2D>this.myCan.getContext("2d");
      if(context)
      {
        context.clearRect(0, 0, this.myCan.width, this.myCan.height);
      }

      this.newTextControlDiv.style.display = "none";
      this.nextStepDisplayDiv.style.display = "block";
    }
    if(this.editMode)
    {
      this.editMode = false;

      var context = <CanvasRenderingContext2D>this.myCan.getContext("2d");
      if(context)
      {
        context.clearRect(0, 0, this.myCan.width, this.myCan.height);
      }

      this.editSelectionDiv.style.display = "none";
      this.editBoxControlDiv.style.display = "none";
      this.nextStepDisplayDiv.style.display = "block";
    }
  }

  /*
    function used to open the edit selection to change bindig Box or alter Text
    used by the hotkey listener
  */
  forceExitMode()
  {
      var curElement = <HTMLButtonElement>document.getElementById("result"+(this.selectedID+1));
      if(curElement){curElement.style.display = "block";}
      this.exitMode();
  }

// Exit-Button-Functions - Used by the exit Buttons of the UI

  /* 
    function used to exit the editing mode, while saving and sending the data to the backend
    Used by the "Speichern und Beenden"-Button
  */
  saveAndExit()
  { 
    //Confirm the User really wants to save and leave this view.
    if(confirm("Wollen sie wirklich Speichern und das Bearbeiten beenden?"))
    {
      console.log("Dieser Button hat in der Test-Version keine Funktion." + 
                  "\nIm Finalen Produkt werden die Änderungen an den Server gesendet um dort gespeichrt zu werden." +
                  "\nZudem wird zurück zur Main-Seite gelinkt, wodurch das Bearbeiten beendet wird.");

      console.log(this.bbArray);
      //Save the Data to the provided Service
      this.exchange.saveUserResult(this.bbArray);
      //Navigate back to the main view
      this.router.navigate(['/main']);
    }
  }

  /* 
    function used to exit the editing mode, without saving any data to the backend
    Used by the "Ohne Speichern beenden"-Button 
  */
  exitEditMode()
  {
    if(confirm("Wollen Sie wirklich das Bearbeiten beenden ohne zu speichern?"))
    {
      console.log("Dieser Button hat in der Test-Version keine Funktion." + 
      "\nIm Finalen Produkt wird zur Main-Seite gelinkt, wodurch das " +
      "Bearbeiten abgebrochen und alle Änderungen verworfen werden.");
    
      this.router.navigate(['/main']);
    }
  }

// handleFunctions - general handle functions for Event listeners

  /*
    helperfunction - Used to handle any 'mousedown' event on the canvas element
    Initiates drawing when called, sets starting coordinates of the rect
  */ 
  handleMouseDown(e: any)
  {
      e.preventDefault();
      e.stopPropagation();
      
      this.startX = Math.floor(e.clientX - this.myCan.getBoundingClientRect().left);
      this.startY = Math.floor(e.clientY - this.myCan.getBoundingClientRect().top);

      this.mouseIsDown = true;
  }

  /*
    helperfunction - Used to handle any 'mouseup' event on the canvas element
    finishes the current drawing when called, calculates size and placement of the BB
  */ 
  handleMouseUp(e: any)
  {
    e.preventDefault();
    e.stopPropagation();

    if(this.selectedID !== -1 && !this.boxEditFlag)
    {
      var curResult = <HTMLButtonElement>document.getElementById("result"+(this.selectedID+1));
      var curResultButton = <HTMLButtonElement>document.getElementById("result"+(this.selectedID+1)+"Button");

      curResult.classList.replace("activeResult", "result");
      curResultButton.classList.remove("active");
    }

    this.mouseIsDown = false;
    var contextOverlay = <CanvasRenderingContext2D>this.myCanOverlay.getContext("2d");
    if(contextOverlay)
    {
      contextOverlay.clearRect(0, 0, this.myCanOverlay.width, this.myCanOverlay.height);
    }

    var rectStartX = 0;
    var rectStartY = 0;
    var rectWidth = 0;
    var rectHeigth = 0;

    this.newButtonX = 0;
    this.newButtonY = 0;
    this.newButtonW = 0;
    this.newButtonH = 0;

    //console.log("X: " + this.prevStartX + " Y: " + this.prevStartY + " W: " + this.prevWidth + " H: " + this.prevHeight);
    
    if((this.prevWidth >= 0) && (this.prevHeight >= 0))
    {

    }
    else if((this.prevWidth >= 0) && (this.prevHeight < 0))
    {
      this.prevStartY += this.prevHeight;
      this.prevHeight *= -1;
    }
    else if((this.prevWidth < 0) && (this.prevHeight >= 0))
    {
      this.prevStartX += this.prevWidth;
      this.prevWidth *= -1;
    }
    else if((this.prevWidth < 0) && (this.prevHeight < 0))
    {
      this.prevStartY += this.prevHeight;
      this.prevHeight *= -1;
      this.prevStartX += this.prevWidth;
      this.prevWidth *= -1;
    }
    
    if(this.imgCanRatio >= 1)
    {
      rectStartX = this.prevStartX;
      rectStartY = this.prevStartY;
      rectWidth = this.prevWidth;
      rectHeigth = this.prevHeight;
    }
    else
    {
      rectStartX = this.prevStartX / this.imgCanRatio;
      rectStartY = this.prevStartY / this.imgCanRatio;
      rectWidth = this.prevWidth / this.imgCanRatio;
      rectHeigth = this.prevHeight / this.imgCanRatio;
    }

    this.newButtonX = rectStartX;
    this.newButtonY = rectStartY;
    this.newButtonW = rectWidth;
    this.newButtonH = rectHeigth;

    this.newTextboxFlag = false;

    var context = <CanvasRenderingContext2D>this.myCan.getContext("2d");
    if(context)
    {
      context.strokeStyle = "lime";
      context.lineWidth = 2;
      context.strokeRect(Math.floor(this.newButtonX * this.imgCanRatio),
                          Math.floor(this.newButtonY * this.imgCanRatio), 
                          Math.ceil(this.newButtonW * this.imgCanRatio), 
                          Math.ceil(this.newButtonH * this.imgCanRatio));
    }
    if(this.newMode)
    {
      this.nextStepDisplay.innerHTML = "Warte auf Eingabe"
      this.nextStepDisplayDiv.style.display = "none";
      this.control.style.display = "none";
      this.newTextControlDiv.style.display = "inline-block";
    }
    if(this.editMode)
    {
      this.nextStepDisplay.innerHTML = "Warte auf Eingabe"
      this.nextStepDisplayDiv.style.display = "none";
      this.editBoxControlDiv.style.display = "inline-block";
    }
  }

  /*
    helperfunction - Used to handle any 'mouseout' event on the canvas element
  */ 
  handleMouseOut(e: any)
  {
      e.preventDefault();
      e.stopPropagation();

      this.mouseIsDown = false;

      var contextOverlay = <CanvasRenderingContext2D>this.myCanOverlay.getContext("2d");
      if(contextOverlay)
      {
        contextOverlay.clearRect(0, 0, this.myCanOverlay.width, this.myCanOverlay.height);
      }
  }

  /*
    helperfunction - Used to handle any 'mousemove' event on the canvas element
  */ 
  handleMouseMove(e: any)
  {
    e.preventDefault();
    e.stopPropagation();
    
    if(!this.mouseIsDown) {return;}

    var mouseX = Math.floor(e.clientX - this.myCan.getBoundingClientRect().left);
    var mouseY = Math.floor(e.clientY - this.myCan.getBoundingClientRect().top);

    var width = mouseX - this.startX;
    var height = mouseY - this.startY;

    var contextOverlay = <CanvasRenderingContext2D>this.myCanOverlay.getContext("2d");
    if(contextOverlay)
    {
      contextOverlay.clearRect(0, 0, this.myCanOverlay.width, this.myCanOverlay.height);
      contextOverlay.strokeStyle = "lime";
      contextOverlay.lineWidth = 2;
      contextOverlay.strokeRect(this.startX, this.startY, width, height);
    }

    this.prevStartX = this.startX;
    this.prevStartY = this.startY;

    this.prevWidth  = width;
    this.prevHeight = height;
  }

  /*
    helperfunction - Used to handle any 'mousedown' event on the canvas element
  */ 
  handleContextMenu(e: any)
  {
      e.preventDefault();
      e.stopPropagation();
  
      this.createNewText();
  }

  /*
    helperfunction - Used to handle any 'load' event on the window element
  */ 
  handleLoad()
  {
    if(window.innerWidth < 800)
      {
          this.sizeCanvasVert(this.imgRatio);
      }
      else
      {
          this.sizeCanvas(this.imgRatio);
      }
      this.offsetY = this.myCan.offsetTop + this.canvWrap.offsetTop;
      this.offsetX = this.myCan.offsetLeft + this.canvWrap.offsetLeft;

      this.adjustPositions();
  }

  /*
    helperfunction - Used to handle any 'resize' event on the window element
  */ 
  handleResize()
  {
    if(window.innerWidth < 800)
    {
        this.sizeCanvasVert(this.imgRatio);
    }
    else
    {
        this.sizeCanvas(this.imgRatio);
    }
    this.offsetY = this.myCan.offsetTop + this.canvWrap.offsetTop;
    this.offsetX = this.myCan.offsetLeft + this.canvWrap.offsetLeft;

    this.adjustPositions();
  }
}