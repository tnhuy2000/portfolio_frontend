import { getImageStrapiUrl } from '@/utils/image';
import Image from 'next/image';


export function StrapiImage({ image, className }: { image: any, className?: string }) {
        console.log('image', image)
    if (!image) return null;

    const url =
        image.formats?.medium?.url ||
        image.formats?.small?.url ||
        image.url;
    console.log('image', getImageStrapiUrl(url))
    return (
        <Image
            src={getImageStrapiUrl(url)}
            alt={image.alternativeText || ''}
            width={image.width}
            height={image.height}
            className={className || ""}
        />
    );
}