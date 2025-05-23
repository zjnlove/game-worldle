import CountryMap from "../components/CountryMap";
import GuessInput from "../components/input/guessInput";
import Guesses from "../components/guesses/guesses";
import CorrectModal from "../components/modal/correctModal";
import CorrectAnswerBtn from "../components/input/checkAnswerBtn";
import Title from "../components/title";
import Head from "next/head";
import ShareButtons from "../components/ShareButtons";
import {
	NewCountry,
	checkGuess,
	getDistanceAndBearing,
} from "../components/util";
import { useEffect, useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addGuess, clearGuesses } from "../store/guessesSlice";
import { showModal, setComplete } from "../store/settingsSlice";
import { setSelection } from "../store/guessSelectionSlice";
import { useI18n } from '../i18n/i18n-utils';
import { addStars, removeStars } from '../components/starsEffect';


export default function Home({locale}) {
	const { t } = useI18n('common');
	const { t: tIntro } = useI18n('game-intro');
	const { t: tFaq } = useI18n('game-faq');
	const guesses = useSelector((state) => state.guesses.value);
	const answer = useSelector((state) => state.answer.value);
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldle.top';

	// 添加引用，用于滚动定位
	const gameRef = useRef(null);
	const introRef = useRef(null);
	const faqRef = useRef(null);

	const guessSelection = useSelector((state) => state.guessSelection.value);
	const isComplete = useSelector((state) => state.settings.value.complete);
	const showModalState = useSelector((state) => state.settings.value.showModal);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [showMoreIntro, setShowMoreIntro] = useState(false);
	const [expandedFaqIndex, setExpandedFaqIndex] = useState(-1);
	const [showHelpSection, setShowHelpSection] = useState(false);

	
	// 添加猜测次数上限
	const MAX_GUESSES = 8;
	const isMaxGuessesReached = guesses.length >= MAX_GUESSES;
	
	const dispatch = useDispatch();

	useEffect(() => {
		if (
			answer &&
			Object.keys(answer).length === 0 &&
			Object.getPrototypeOf(answer) === Object.prototype
		) {
			NewCountry();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	// 检测当前主题
	useEffect(() => {
		const checkDarkMode = () => {
			const theme = document.documentElement.getAttribute('data-theme');
			setIsDarkMode(theme === 'dark');
		};
		
		// 初始检测
		checkDarkMode();
		
		// 创建一个观察器监听data-theme属性变化
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'data-theme') {
					checkDarkMode();
				}
			});
		});
		
		// 开始观察
		observer.observe(document.documentElement, { attributes: true });
		
		// 添加星星背景点缀（仅在暗色模式）
		if (isDarkMode) {
			addStars();
		}
		
		// 清理观察器和星星
		return () => {
			observer.disconnect();
			removeStars();
		};
	}, [isDarkMode]);

	useEffect(() => {
		if (guesses.length > 0) {
			// checkGuess(guesses[guesses.length - 1], answer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [guesses]);

	//Start new game, cleans up guesses and answer
	const newGame = () => {
		dispatch(setComplete(false));
		dispatch(showModal(false));
		dispatch(clearGuesses());
		NewCountry();
	};

	//Clear input and add guess to redux store
	const onSubmit = () => {
		if (guessSelection !== null && !isMaxGuessesReached) {
			let result = checkGuess(guessSelection, answer);

			//Answer correct
			if (result) {
				dispatch(
					addGuess({
						...guessSelection,
						distance: 0,
						bearing: 0,
						correct: result,
					})
				);
				dispatch(setComplete(true));
				dispatch(showModal(true));
			} else {
				const { distance, bearing } = getDistanceAndBearing(
					guessSelection,
					answer
				);
				dispatch(
					addGuess({
						...guessSelection,
						distance: distance,
						bearing: bearing,
						correct: result,
					})
				);
			}
			//Clear selection on submit
			dispatch(setSelection(null));
		}
	};

	// Make sure the success modal is displayed correctly
	const modalComponent = <CorrectModal playAgainPress={() => newGame()} />;

	// Ensure the map is only shown during the game or in the modal, avoiding multiple maps at the same time
	const mapComponent = !showModalState && !isComplete;

	// 安全获取FAQ数据
	const getFaqItems = () => {
		try {
			const faqData = tFaq('faqItems', { returnObjects: true });
			console.log('FAQ数据类型:', typeof faqData, Array.isArray(faqData));
			
			if (Array.isArray(faqData)) {
				return faqData;
			} else if (faqData && typeof faqData === 'object') {
				// 如果返回的是对象而不是数组，尝试转换成数组
				return Object.values(faqData);
			} else {
				console.error('FAQ数据不是数组或对象:', faqData);
				// 如果数据获取失败，返回空数组避免渲染错误
				return [];
			}
		} catch (error) {
			console.error('获取FAQ项目时出错:', error);
			return [];
		}
	};

	// 滚动到指定区域的函数
	const scrollToSection = (ref) => {
		if (ref && ref.current) {
			ref.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-[--background-primary] relative overflow-hidden transition-colors duration-300">
			{/* 吉卜力风格的装饰元素 */}
			<div className={`decorative-element leaf ${isDarkMode ? 'dark' : ''}`}>
				<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<path fill="var(--ghibli-green)" d="M47.1,-57.3C59.8,-47.4,68.9,-32.4,72.1,-16.1C75.3,0.2,72.6,17.8,64.7,31.5C56.7,45.2,43.6,55,29.3,61.9C15,68.9,-0.4,73,-15.6,70.5C-30.7,68,-45.7,58.9,-56.8,45.6C-67.9,32.2,-75.1,14.6,-74.1,-2.5C-73.1,-19.6,-63.8,-36.1,-50.6,-46.5C-37.3,-56.9,-20.2,-61.2,-2.4,-58.4C15.4,-55.7,34.3,-46,47.1,-57.3Z" transform="translate(100 100)" />
				</svg>
			</div>
			
			<div className={`decorative-element cloud ${isDarkMode ? 'dark' : ''}`}>
				<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<path fill="var(--ghibli-blue)" d="M39.9,-45.7C51.2,-34,59.9,-21,65.4,-5.5C70.9,10,73.2,28,65.7,39.9C58.2,51.8,40.9,57.8,23.8,63C6.7,68.3,-10.1,72.9,-24.9,69C-39.8,65,-52.7,52.6,-59.3,37.7C-65.9,22.8,-66,5.4,-62.3,-10.1C-58.5,-25.7,-50.8,-39.3,-39.5,-51C-28.2,-62.8,-13.3,-72.8,0.1,-72.9C13.6,-73,27.2,-63.2,39.9,-45.7Z" transform="translate(100 100)" />
				</svg>
			</div>
			
			{/* 仅在暗色模式下添加月亮装饰 */}
			{isDarkMode && (
				<div className="moon-decoration">
					<div className="moon"></div>
					<div className="moon-glow"></div>
				</div>
			)}
			
			<div className="flex-1 flex flex-col items-center py-4 px-4 z-10 max-w-2xl mx-auto w-full">
				{/* 将游戏介绍和FAQ移到这里，设置更宽 */}
				<div className="w-full max-w-4xl mx-auto" ref={gameRef}>
					{modalComponent}
					<div className="w-full mb-4 title-container">
						<Title />
					</div>
				</div>
				<div className="w-full flex flex-col items-center">
					<div className="w-full max-w-md">
						{mapComponent && (
							<div className={`w-full map-container ${isDarkMode ? 'dark-map-container' : ''} bg-white rounded-2xl shadow-lg p-3 mb-4 md:mb-5 border ${isDarkMode ? 'border-transparent' : 'border-[--border-color]'} transform hover:scale-105 transition-transform duration-300`}>
								<CountryMap className={"w-full"} />
							</div>
						)}
						
						{(isComplete || isMaxGuessesReached) && !showModalState ? (
							<button
								className="ghibli-btn text-lg py-2 px-10 mb-3 w-full"
								onClick={() => newGame()}
							>
								{t('playAgain')}
							</button>
						) : null}
						
						<GuessInput isDisabled={isMaxGuessesReached || isComplete} />
						
						{!isComplete && !isMaxGuessesReached && (
							<div className="w-full my-3 md:my-4">
								<CorrectAnswerBtn onSubmit={() => onSubmit()} />
							</div>
						)}
						
						{isMaxGuessesReached && !isComplete && (
							<div className="w-full my-2 text-center text-[--ghibli-brown] font-medium py-2 bg-red-100 rounded-md border border-red-200">
								{t('maxGuessesReached')}
							</div>
						)}
						
						<div className="w-full mt-1">
							<Guesses />
						</div>

						{/* 分享按钮 */}
						<div className="w-full mt-5 mb-2 py-2 px-1 rounded-lg">
							<h2 className="text-center text-[--ghibli-brown] text-xl font-bold mb-2">Share on social media</h2>
							<ShareButtons url={siteUrl} title={`Worldle - ${t('title')}`} />
						</div>
												
						{/* 帮助按钮 */}
						{/* <button 
							className="help-toggle-btn mx-auto mt-4 text-[--ghibli-primary] hover:text-[--ghibli-primary-dark] font-medium flex items-center gap-2 bg-[--background-secondary] py-2 px-6 rounded-full shadow-sm border border-[--border-color] transition-all duration-300"
							onClick={() => setShowHelpSection(!showHelpSection)}
						>
							{showHelpSection ? (
								<>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
									</svg>
									{t('hideHelp')}
								</>
							) : (
								<>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
									</svg>
									{t('showHelp')}
								</>
							)}
						</button> */}
						
					</div>
				</div>
				{/* 游戏介绍和FAQ区域，宽度放大 */}
				<div className="w-full max-w-2xl mx-auto">
					<div ref={introRef} className="w-full mt-3 game-intro-container rounded-xl p-4 shadow-md border border-[--border-color] transition-all duration-300 hover:shadow-lg animate-slideDown">
						<h2 className="text-2xl font-bold text-[--ghibli-brown] mb-3">{tIntro('gameIntroTitle')}</h2>
						<div className="text-[--text-secondary] text-lg space-y-2">
							<p>{tIntro('gameIntroDesc')}</p>
							<div className="pt-1">
								<h3 className="text-xl font-bold text-[--ghibli-brown] mb-2">{tIntro('howToPlayTitle')}</h3>
								<ul className="list-disc list-inside space-y-1">
									<li>{tIntro('howToPlay1')}</li>
									<li>{tIntro('howToPlay2')}</li>
									<li>{tIntro('howToPlay3')}</li>
									<li>{tIntro('howToPlay4')}</li>
								</ul>
							</div>
							<div className="pt-1">
								<button 
									className="text-[--ghibli-primary] hover:text-[--ghibli-primary-dark] transition-colors duration-200 text-lg font-medium flex items-center" 
									onClick={() => setShowMoreIntro(!showMoreIntro)}
								>
									<span>{showMoreIntro ? tIntro('showLess') : tIntro('readMore')}</span>
									<svg 
										xmlns="http://www.w3.org/2000/svg" 
										className={`h-4 w-4 ml-1 transform transition-transform duration-300 ${showMoreIntro ? 'rotate-180' : ''}`} 
										fill="none" 
										viewBox="0 0 24 24" 
										stroke="currentColor"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</button>
								{showMoreIntro && (
									<div className="mt-2 space-y-2 animate-fadeIn">
										<p>{tIntro('gameIntroExtended')}</p>
										<p>{tIntro('gameFeatures')}</p>
									</div>
								)}
							</div>
						</div>
					</div>
					<div ref={faqRef} className="w-full mt-3 rounded-xl p-4 shadow-md border border-[--border-color] transition-all duration-300 animate-slideDown">
						<h2 className="text-2xl font-bold text-[--ghibli-brown] mb-4">{tFaq('faqTitle')}</h2>
						<div className="space-y-1">
							{getFaqItems().map((item, index) => (
								<div key={index} className="border-b border-[--border-color]">
									<button 
										className="text-xl w-full py-3 flex justify-between items-center text-left font-medium text-[--text-primary] focus:outline-none"
										onClick={() => setExpandedFaqIndex(expandedFaqIndex === index ? -1 : index)}
									>
										<span>{item.question}</span>
										<svg 
											xmlns="http://www.w3.org/2000/svg" 
											className={`h-5 w-5 transform transition-transform duration-300 ${expandedFaqIndex === index ? 'rotate-180' : ''}`} 
											fill="none" 
											viewBox="0 0 24 24" 
											stroke="currentColor"
										>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</button>
									{expandedFaqIndex === index && (
										<div className="pb-3 text-[--text-secondary] text-lg animate-fadeIn">
											<p>{item.answer}</p>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			
			{/* 页脚导航 */}
			<footer className="w-full bg-transparent border-t border-[--border-color] py-3 px-4 mt-8 z-20">
				<div className="max-w-2xl mx-auto flex justify-between items-center">
					<div className="text-[--text-secondary] text-sm">
						© 2025 • Worldle Unlimited. <a href="https://worldle.top" className="text-[--ghibli-green] hover:text-[--ghibli-night-green-dark] transition-colors duration-200">worldle.top</a>
					</div>
					<div className="flex space-x-2">
						<button 
							onClick={() => scrollToSection(gameRef)}
							className="footer-nav-btn"
							aria-label="回到游戏"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
							</svg>
							<span>Home</span>
						</button>
						<button 
							onClick={() => scrollToSection(introRef)}
							className="footer-nav-btn"
							aria-label="游戏介绍"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
							</svg>
							<span>About</span>
						</button>
						<button 
							onClick={() => scrollToSection(faqRef)}
							className="footer-nav-btn"
							aria-label="常见问题"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
							</svg>
							<span>FAQ</span>
						</button>
					</div>
				</div>
			</footer>
		</div>
	);
}

export async function getServerSideProps({ locale }) {
	// 定义首页使用的结构化数据
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"name": "Worldle Unlimited",
		"alternateName": "WORLDLE UNLIMITED",
		"description": "Play Worldle Unlimited, the fun geography game where you guess countries from their silhouette. Enjoy unlimited games with Worldle Unlimited.",
		"url": process.env.NEXT_PUBLIC_SITE_URL || 'https://worldle.top',
		"applicationCategory": "GameApplication",
		"genre": "Geography Quiz",
		"operatingSystem": "Web Browser",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		}
	};

	return {
		props: {
			locale,
			// 添加SEO相关数据
			structuredData,
			canonicalPath: '/',
			ogImage: 'worldle-og-image.png'
		},
	};
}
