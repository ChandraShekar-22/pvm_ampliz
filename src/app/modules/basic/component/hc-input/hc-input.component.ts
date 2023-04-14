import { Component, Input, forwardRef, AfterViewInit, OnChanges, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, UntypedFormControl } from '@angular/forms';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => HcInputComponent),
    multi: true
};

@Component({
  selector: 'app-hc-input',
  templateUrl: './hc-input.component.html',
  styleUrls: ['./hc-input.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class HcInputComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
    @Input()  isFormSubmitted = false;

    @Input()  type = "text"; 

    @Input()  id = ""; 

    @Input()  text = ""; 

    @Input()  placeholder:string; 

    @Input() c:UntypedFormControl = new UntypedFormControl(); 

    @Input() optional : boolean = false;

    errors:Array<any> = ['This field is required']; 

    // get reference to the input element
    @ViewChild('input',{static:true})  inputRef:ElementRef; 


    constructor() {

    }

    ngOnChanges(){

    }

    //Lifecycle hook. angular.io for more info
    ngAfterViewInit(){ 
    //   console.log(this.c)
        // set placeholder default value when no input given to placeholder property      
        if(this.placeholder === undefined){
            this.placeholder = "Enter "+this.text; 
        }

        // RESET the custom input form control UI when the form control is RESET
        this.c.valueChanges.subscribe(
            () => {
            //   console.log(this.c.errors)
                // check condition if the form control is RESET
                if (this.c.value == "" || this.c.value == null || this.c.value == undefined) {
                    this.innerValue = "";      
                    this.inputRef.nativeElement.value = "";                 
                }
            }
        );
    }

   //The internal data model for form control value access
    private innerValue: any = '';

    // event fired when input value is changed . later propagated up to the form control using the custom value accessor interface
    onChange(e:Event, value:any){
    //     console.log(this.c)
    //   console.log(this.c.errors)
        this.innerValue = value;
        this.propagateChange(this.innerValue);

        //reset errors 
        this.errors = [];
        //setting, resetting error messages into an array (to loop) and adding the validation messages to show below the field area
        // for (var key in this.c.errors) {
        //     if (this.c.errors.hasOwnProperty(key)) {
        //         if(key === "required"){
        //             this.errors.push("This field is required");
        //         }else{
        //             this.errors.push(this.c.errors[key]);
        //         }              
        //     }
        // }
    }



    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
        }
    }

    //propagate changes into the custom form control
    propagateChange = (_: any) => { }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        this.innerValue = value;
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {

    }

}
