import {CK,type CanvasKit} from './canvaskit'

function textToArrayBuffer(text:string){
    const blob=new Blob([text],{type:'text/plain'})
    return blob.arrayBuffer()
}
async function getTextBounds(text:string,textStyle:CanvasKit.TextStyle){
    const blob=new Blob([text],{type:'text/plain'})
    const textBuffer=await blob.arrayBuffer()
    const fontMgr = CK.FontMgr.FromData(textBuffer); // 加载字体数据[citation:1]
    const paraStyle = new CK.ParagraphStyle({
        textStyle:textStyle
    });
    const builder = CK.ParagraphBuilder.Make(paraStyle, fontMgr);
    builder.addText(text);
    const paragraph = builder.build();
    paragraph.layout(100)
    return paragraph.getLineMetrics()
}