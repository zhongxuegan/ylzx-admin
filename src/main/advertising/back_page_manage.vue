<template>
	<div>
		<el-form ref="backForm" :model="backForm" label-width="200px">
			<el-form-item label="栏目分类">
				<el-checkbox-group v-model="classifyIds">
					<el-checkbox v-for="item in classifyList" :disabled="!isEdit" name="wexinClassify" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="文章">
				<template v-if="isEdit">
					<el-input type="number" class="input--width200" v-model="backForm.articleScale"></el-input>
				</template>
				<template v-else>
					<span>{{ backForm.articleScale }}</span>
				</template>
			</el-form-item>
			<el-form-item label="广告">
				<template v-if="isEdit">
					<el-input type="number" class="input--width200" v-model="backForm.advertScale"></el-input>
				</template>
				<template v-else>
					<span>{{ backForm.advertScale }}</span>
				</template>
			</el-form-item>
			<el-form-item label="显示条数">
				<template v-if="isEdit">
					<el-input type="number" class="input--width200" v-model="backForm.showCount"></el-input>
				</template>
				<template v-else>
					<span>{{ backForm.showCount }}</span>
				</template>
			</el-form-item>
			<el-form-item label="一反广告名称">
				<template v-if="isEdit">
					<el-input maxlength="50" show-word-limit class="input--width200" v-model="backForm.oneAdvertName" style="width:400px;"></el-input>
				</template>
				<template v-else>
					<span>{{ backForm.oneAdvertName }}</span>
				</template>
			</el-form-item>
			<el-form-item label="一反后退页链接">
				<template v-if="isEdit">
					<el-input class="input--width200" style="width:400px;" v-model="backForm.url"></el-input>
				</template>
				<template v-else>
					<span>{{ backForm.url }}</span>
				</template>
			</el-form-item>
			<el-form-item label="二反广告名称">
				<template v-if="isEdit">
					<el-input maxlength="50" show-word-limit class="input--width200" v-model="backForm.twoAdvertName" style="width:400px;"></el-input>
				</template>
				<template v-else>
					<span>{{ backForm.twoAdvertName }}</span>
				</template>
			</el-form-item>
			<el-form-item label="二反后退页链接">
				<template v-if="isEdit">
					<el-input class="input--width200" style="width:400px;" v-model="backForm.twoUrl"></el-input>
				</template>
				<template v-else>
					<span>{{ backForm.twoUrl }}</span>
				</template>
			</el-form-item>
			<el-form-item label="三反广告名称">
				<template v-if="isEdit">
					<el-input maxlength="50" show-word-limit class="input--width200" v-model="backForm.threeAdvertName" style="width:400px;"></el-input>
				</template>
				<template v-else>
					<span>{{ backForm.threeAdvertName }}</span>
				</template>
			</el-form-item>
			<el-form-item label="三反后退页链接">
				<template v-if="isEdit">
					<el-input class="input--width200" style="width:400px;" v-model="backForm.threeUrl"></el-input>
				</template>
				<template v-else>
					<span>{{ backForm.threeUrl }}</span>
				</template>
			</el-form-item>
			<el-form-item style="display:block;">
				<el-button v-if="!isEdit" type="primary" @click="edit">修改</el-button>
				<template v-else>
					<el-button type="default" @click="reset">取消</el-button>
					<el-button type="primary" @click="confirm">确认</el-button>
				</template>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
export default {
	name: 'backPageManager',
	data() {
		return {
			isEdit: false,
			page: 1,
			classifyList: [],
			classifyIds: [],
			originClassifyList: [],
			backFormOrigin: {},
			classifyIdsOrigin: [],
			backForm: {
				articleScale: null,
				advertScale: null,
				showCount: null,
				url: null,
				twoUrl: null,
				threeUrl: null,
				oneAdvertName: null,
				twoAdvertName: null,
				threeAdvertName: null
			}
		};
	},
	created() {
		this.getClassifyList();
		this.getsettingData();
	},
	methods: {
		async getClassifyList() {
			let postData = {
				params: {
					page: 1,
					size: 100,
					deleteFlag: '0',
					name: ''
				}
			};
			let {
				data: {
					data: { list }
				}
			} = await this.$axios.get(this.BASE_URL + 'admin/article/classify/list', postData);
			this.classifyList = list;
			this.classifyIds = this.pushSelectedClassfiyFromClassifyList();
			this.classifyIdsOrigin = [...this.classifyIds];
		},
		async getsettingData() {
			let {
				data: {
					data: { showCount, advertScale, articleScale, url, twoUrl, threeUrl,oneAdvertName,twoAdvertName,threeAdvertName }
				}
			} = await this.$axios.post(this.BASE_URL + 'admin/article/back/page/config/getBackPageConfig');
			this.backForm = {
				showCount,
				advertScale,
				articleScale,
				url,
				twoUrl,
				threeUrl,
				oneAdvertName,
				twoAdvertName,
				threeAdvertName
			};
			this.backFormOrigin = Object.assign({}, this.backForm);
		},
		pushorignClassifyList() {
			let result = [];
			this.classifyList.map(item => {
				result.push(item.id);
			});
			return result;
		},
		pushSelectedClassfiyFromClassifyList() {
			let result = [];
			this.classifyList.map(item => {
				if (item.backPageCheckFlag === 1) {
					result.push(item.id);
				}
			});
			return result;
		},
		async saveBackUpateConfig() {
			this.originClassifyList = this.pushorignClassifyList();
			let result = this.generateClassifyList(this.originClassifyList, this.classifyIds);
			this.backForm.classifys = result;
			await this.$axios.post(this.BASE_URL + 'admin/article/back/page/config/updateBackPageConfig', this.backForm);
			this.$message({
				message: '修改成功',
				type: 'success'
			});
			this.getClassifyList();
			this.getsettingData();
			this.isEdit = false;
		},

		// 根据选中的classifyId生成后台需要的格式
		generateClassifyList(arrParent, arrChild) {
			let result = [];
			for (let i = 0; i < arrParent.length; i++) {
				result.push({ id: arrParent[i], backPageCheckFlag: 0 });
				for (let j = 0; j < arrChild.length; j++) {
					if (arrChild[j] === arrParent[i]) {
						result[i].backPageCheckFlag = 1;
					}
				}
			}
			return result;
		},
		reset() {
			this.classifyIds = this.classifyIdsOrigin;
			this.backForm = Object.assign({}, this.backFormOrigin);
			this.isEdit = false;
		},
		confirm() {
			this.saveBackUpateConfig();
		},
		edit() {
			this.isEdit = true;
		}
	}
};
</script>
<style>
.input--width200 {
	width: 200px;
}
</style>
