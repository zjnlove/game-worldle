import React, { useEffect, useState } from 'react';

const ShareButtons = ({ url, title }) => {
  // 确保URL和标题有默认值
  const shareUrl = url || 'https://worldle-game.com';
  const shareTitle = title || 'Worldle - Geography Guessing Game';
  const [nativeShareAvailable, setNativeShareAvailable] = useState(false);
  
  // 检查浏览器是否支持原生分享API
  useEffect(() => {
    setNativeShareAvailable(!!navigator.share);
  }, []);
  
  // 使用原生分享API
  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: shareTitle,
        url: shareUrl
      });
      console.log('内容已成功分享');
    } catch (error) {
      console.error('分享失败:', error);
    }
  };
  
  // 分享函数
  const handleShare = (platform) => {
    // 对于移动设备，如果支持原生分享，优先使用原生分享
    if (platform === 'native' && nativeShareAvailable) {
      handleNativeShare();
      return;
    }
    
    let shareLink = '';
    
    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'reddit':
        shareLink = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
        break;
      case 'pinterest':
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareTitle)}`;
        break;
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
        break;
      default:
        return;
    }
    
    // 打开新窗口进行分享
    window.open(shareLink, '_blank', 'width=600,height=400');
  };
  
  return (
    <div className="share-buttons-container flex flex-wrap justify-center items-center gap-2 my-4">
      {nativeShareAvailable && (
        <button 
          onClick={() => handleShare('native')} 
          className="share-btn bg-[--ghibli-deep-blue] text-white hover:bg-[--background-secondary] hover:text-[--ghibli-deep-blue] border border-[--ghibli-deep-blue] px-3 py-2 sm:px-5 rounded-md flex items-center justify-center transition-colors duration-300 text-sm sm:text-base shadow-md"
          aria-label="使用设备分享"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
          </svg>
          {/* 分享到设备 */}
        </button>
      )}
      
      <button 
        onClick={() => handleShare('facebook')} 
        className="share-btn bg-[--ghibli-blue] text-white hover:bg-[--background-secondary] hover:text-[--ghibli-blue] border border-[--ghibli-blue] px-3 py-2 sm:px-4 rounded flex items-center justify-center transition-colors duration-300 text-sm sm:text-base"
        aria-label="Share to Facebook"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
        {/* <span className="hidden sm:inline">分享</span> */}
      </button>
      
      <button 
        onClick={() => handleShare('twitter')} 
        className="share-btn bg-[--ghibli-black] text-white hover:bg-[--background-secondary] hover:text-[--ghibli-black] border border-[--ghibli-black] px-3 py-2 sm:px-4 rounded flex items-center justify-center transition-colors duration-300 text-sm sm:text-base"
        aria-label="Share to Twitter"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        {/* <span className="hidden sm:inline">推文</span> */}
      </button>
      
      <button 
        onClick={() => handleShare('reddit')} 
        className="share-btn bg-[--ghibli-orange] text-white hover:bg-[--background-secondary] hover:text-[--ghibli-orange] border border-[--ghibli-orange] px-3 py-2 sm:px-4 rounded flex items-center justify-center transition-colors duration-300 text-sm sm:text-base"
        aria-label="Share to Reddit"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.003-.013.003c-1.777 0-3.028-.386-3.824-1.179-.145-.144-.145-.379 0-.523.145-.145.381-.145.526 0 .65.647 1.729.961 3.298.961l.013.003.013-.003c1.569 0 2.648-.315 3.298-.962.145-.145.381-.144.526 0 .145.145.145.379 0 .524zm-.189-3.095c-.872 0-1.581-.706-1.581-1.574 0-.868.709-1.575 1.581-1.575s1.581.707 1.581 1.575-.709 1.574-1.581 1.574z" />
        </svg>
        {/* <span className="hidden sm:inline">分享</span> */}
      </button>
      
      <button 
        onClick={() => handleShare('pinterest')} 
        className="share-btn bg-[--ghibli-red] text-white hover:bg-[--background-secondary] hover:text-[--ghibli-red] border border-[--ghibli-red] px-3 py-2 sm:px-4 rounded flex items-center justify-center transition-colors duration-300 text-sm sm:text-base"
        aria-label="Share to Pinterest"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
        {/* <span className="hidden sm:inline">钉住</span> */}
      </button>
      
      <button 
        onClick={() => handleShare('whatsapp')} 
        className="share-btn bg-[--ghibli-green] text-white hover:bg-[--background-secondary] hover:text-[--ghibli-green] border border-[--ghibli-green] px-3 py-2 sm:px-4 rounded flex items-center justify-center transition-colors duration-300 text-sm sm:text-base"
        aria-label="Share to WhatsApp"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {/* <span className="hidden sm:inline">分享</span> */}
      </button>
    </div>
  );
};

export default ShareButtons; 