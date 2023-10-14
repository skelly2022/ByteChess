import {SiGitbook} from "react-icons/si"
import {RiDiscordFill} from "react-icons/ri"


const Footer = () => {
    return (
    <div className="w-full h-[70px] bg-green flex items-center justify-center gap-3 cursor-pointer">
         <a href="https://bytechess.gitbook.io/bytechess-revolutionizing-the-chess-experience/" target="_blank" rel="noopener noreferrer">
         <SiGitbook size={30}/>
        </a>   
        <a href="https://twitter.com/bytechessio" target="_blank" rel="noopener noreferrer">
        <img src="images/logo-black.png" className="w-[25px] h-[25px]"></img>
        </a>   
         <a href="https://discord.gg/QM8xXrh9ek" target="_blank" rel="noopener noreferrer">
            <RiDiscordFill size={30} />
        </a>    
</div>
    );
}
 
export default Footer;