const mix=(a,b,t)=>a+(b-a)*t;
// Pixel slots are the source of truth; world size is derived from their available area.
export function cameraLayout({home,anchor,park,stage,emerge=0,dive=0}){
 const width=Math.max(1,stage.width),height=Math.max(1,stage.height);
 const center=rect=>({x:(rect.left+rect.width/2-stage.left)/width,y:(rect.top+rect.height/2-stage.top)/height});
 const start=center(home),end=center(anchor),lens=center(park);
 const homePixels=Math.min(home.width,home.height)*.94,kitPixels=Math.min(anchor.width,anchor.height)*.94;
 return {x:mix(mix(start.x,.62,dive),end.x,emerge),y:mix(mix(start.y,.82,dive),end.y,emerge),cameraPixels:mix(homePixels,kitPixels,emerge),parkX:lens.x,parkY:lens.y,lensPixels:Math.min(park.width,park.height)*.85,liftPixels:Math.min(55,anchor.height*.2)};
}
