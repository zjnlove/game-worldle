import React from "react";
import PropTypes from "prop-types";

function Modal(props) {
	return (
		<>
			{props.show ? (
				<>
					{/* 添加背景蒙层 */}
					<div className="fixed inset-0 bg-black bg-opacity-50 z-10 backdrop-blur-sm transition-all duration-300"></div>
					
					{/* 模态框内容 */}
					<div
						className={
							"fixed z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-auto animate-fadeInDown"
						}
					>
						{props.children}
					</div>
				</>
			) : (
				<div></div>
			)}
		</>
	);
}

Modal.propTypes = {};

export default Modal;
