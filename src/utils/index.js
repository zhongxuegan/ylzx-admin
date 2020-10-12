import moment from 'moment';
export function debounce(func, wait, immediate) {
	let timeout, args, context, timestamp, result

	const later = function () {
		// 据上一次触发时间间隔
		const last = +new Date() - timestamp

		// 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
		if (last < wait && last > 0) {
			timeout = setTimeout(later, wait - last)
		} else {
			timeout = null
			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
			if (!immediate) {
				result = func.apply(context, args)
				if (!timeout) context = args = null
			}
		}
	}
	return function (...args) {
		context = this
		timestamp = +new Date()
		const callNow = immediate && !timeout
		// 如果延时不存在，重新设定延时
		if (!timeout) timeout = setTimeout(later, wait)
		if (callNow) {
			result = func.apply(context, args)
			context = args = null
		}

		return result
	}
}

// 所有活动 元转分 分转元
// @param1:Object
// @param1:boolean  true:分转元 false/不传:元转分
export function formatUnit(obj, flag) {
	if (obj.constructor !== Object) return obj;
	// 以下字段需要转换
	let updateParam = [
		'limitHighAdUnit',
		'divideUpAmt',
		'divideUpForward',
		'effectiveDiscipleDrawMoney',
		'effectiveDiscipleDrawMoneyAward',
		'signInForward',
		'awardAmt',
		'rankNum',
		'subAwardAmt',
		'subNumberValue'
	];
	// 判断 是否存在 updateParam数组里 
	// const isExist = val => updateParam.some(item => val === item);
	const isExist = val => updateParam.includes(val);

	const verifyCode = (key, value) => {
		if (isExist(key) && value[key] !== null) {
			if (flag && flag === true) {
				value[key] /= 100;
			} else {
				value[key] *= 100;
			}
		}
	}

	for (let key in obj) {
		let val = obj[key];
		if (val.constructor === Object) {
			for (let key1 in val) {
				verifyCode(key1, val);
			}
		}
		if (val.constructor === Array) {
			val.forEach(item => {
				for (let key1 in item) {
					verifyCode(key1, item);
				}
			})
		}
	}
	return obj;
}


// 导出
export function exportExcel(obj) {
	// 格式化 导出数据
	let {
		header,
		data,
		filterVal,
		filename
	} = obj;
	if (!header) header = filterVal;
	data = data.map(item => filterVal.map(item1 => item[item1]))
	import('@/vendor/Export2Excel').then(excel => {
		excel.export_json_to_excel({
			header,
			data,
			filename,
			autoWidth: true,
			bookType: 'xlsx'
		});
	})
}

export function getPlusTime(date) {
	return moment(date).add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
}