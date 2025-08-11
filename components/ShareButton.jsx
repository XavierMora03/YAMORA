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
        <h3 className='text-xl font-bold text-center pt-2'>Share This Property</h3>
        <div className='flex gap-3 justify-center pb-5'>
            <FacebookShareButton url={shareUrl} quote={property.name} hashtag={`#${property.type.replace(/\s/g,'')}RentaDisponible`}></FacebookShareButton>
            <FacebookIcon size={40} round={true}></FacebookIcon>
            
            <TwitterShareButton url={shareUrl} quote={property.name} 
            hashtag={[`#${property.type.replace(/\s/g,'')}RentaDisponible`]
            }></TwitterShareButton>
            <TwitterIcon size={40} round={true}></TwitterIcon>

            <WhatsappShareButton url={shareUrl} title={property.name} 
            
            separator='::'
            ></WhatsappShareButton>
            <WhatsappIcon size={40} round={true}></WhatsappIcon>

            <EmailShareButton url={shareUrl} subject={property.name} 
            body={`Mira esta propiedad en renta ${shareUrl}`}
            ></EmailShareButton>
            <EmailIcon size={40} round={true}></EmailIcon>
        </div>
       </>
    );
}
 
export default ShareButton;