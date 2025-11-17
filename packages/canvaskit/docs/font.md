```css
font = 
  [ [ <'font-style'> || <font-variant-css2> || <'font-weight'> || <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ]  |
  <system-family-name>                                

<font-style> = 
  normal                           |
  italic                           |
  left                             |
  right                            |
  oblique <angle [-90deg,90deg]>?  

<font-variant-css2> = 
  normal      |
  small-caps  

<font-weight> = 
  <font-weight-absolute>  |
  bolder                  |
  lighter                 

<font-width-css3> = 
  normal           |
  ultra-condensed  |
  extra-condensed  |
  condensed        |
  semi-condensed   |
  semi-expanded    |
  expanded         |
  extra-expanded   |
  ultra-expanded   

<font-size> = 
  <absolute-size>            |
  <relative-size>            |
  <length-percentage [0,∞]>  |
  math                       

<line-height> = 
  normal                     |
  <number [0,∞]>             |
  <length-percentage [0,∞]>  

<font-family> = 
  [ <family-name> | <generic-family> ]#  

<system-family-name> = 
  caption        |
  icon           |
  menu           |
  message-box    |
  small-caption  |
  status-bar     

<font-weight-absolute> = 
  normal             |
  bold               |
  <number [1,1000]>  

<length-percentage> = 
  <length>      |
  <percentage>  

<family-name> = 
  <string>         |
  <custom-ident>+  

<generic-family> = 
  <generic-script-specific>  |
  <generic-complete>         |
  <generic-incomplete>       

<generic-script-specific> = 
  generic( fangsong )   |
  generic( kai )        |
  generic( khmer-mul )  |
  generic( nastaliq )   

<generic-complete> = 
  serif       |
  sans-serif  |
  system-ui   |
  cursive     |
  fantasy     |
  math        |
  monospace   

<generic-incomplete> = 
  ui-serif       |
  ui-sans-serif  |
  ui-monospace   |
  ui-rounded     

```