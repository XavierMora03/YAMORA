'use client';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    EmailIcon
} from 'react-share'
const ShareButton = ({property}) => {
    const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`
    console.log(shareUrl)
    return (
       <>
        <h3 className='text-xl font-bold text-center pt-2'>Compartir propiedad</h3>
        <div className='flex gap-3 justify-center pb-5'>
            <FacebookShareButton url={shareUrl} quote={property.name} hashtag={`#${property.type.replace(/\s/g,'')}RentaDisponible`}>
                 <FacebookIcon size={40} round={true}></FacebookIcon>
            </FacebookShareButton>
           
            
            <TwitterShareButton url={shareUrl} quote={property.name} 
            hashtag={[`#${property.type.replace(/\s/g,'')}RentaDisponible`]
            }>
                  <TwitterIcon size={40} round={true}></TwitterIcon>
            </TwitterShareButton>
          

            <WhatsappShareButton url={shareUrl} title={property.name} 
            separator='::'
            >
                <WhatsappIcon size={40} round={true}></WhatsappIcon>
            </WhatsappShareButton>
            

            <EmailShareButton url={shareUrl} subject={property.name} 
            body={`Mira esta propiedad en renta ${shareUrl}`}
            >
                <EmailIcon size={40} round={true}></EmailIcon>
            </EmailShareButton>
            
        </div>
       </>
    );
}
 
export default ShareButton;