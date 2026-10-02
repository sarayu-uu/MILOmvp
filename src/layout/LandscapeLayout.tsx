import './landscape.css'

/** A real landscape viewport keeps media queries and touch coordinates aligned. */
export function LandscapeLayout(){
 return <div className="landscape-viewport"><iframe data-milo-viewport title="Milo's world" src={window.location.href} className="landscape-app"/></div>
}
