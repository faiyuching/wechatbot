<template>
    <create-view
      v-loading="loading"
      :body-style="{ height: '100%'}"
    >
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
        <flexbox class="crm-create-header">
          <div style="flex:1;font-size:17px;color:#333;">{{ textMap[action.type]}}</div>
          <img
            class="close"
            src="@/assets/img/task_close.png"
            @click="hidenView" >
        </flexbox>
        <div class="crm-create-flex">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="85px" style="width: 440px; margin-left:50px;">
            <el-form-item label="标题" prop="link_title">
              <el-input v-model="temp.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="消息类型">
              <el-radio-group v-model="temp.type">
                <el-radio :label="1">文字</el-radio>
                <el-radio :label="2">图文</el-radio>
                <el-radio :label="3">入群邀请</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="内容">
              <el-input v-model="temp.reply" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="标签">
							<el-autocomplete v-if="inputVisible" size="small" v-model="inputValue" ref="saveTagInput" :fetch-suggestions="querySearch" placeholder="请选择或输入标签" @select="handleSelect" @change="handleChange"></el-autocomplete>
							<el-button v-else size="small" @click="showInput">+ 添加标签</el-button>
							<br>
							<el-tag :key="tag.id" v-for="tag in temp.tags" closable  @close="handleClose(tag)">{{tag.value}}</el-tag>
            </el-form-item>
          </el-form>
        </div>

        <div class="handle-bar">
          <el-button class="handle-button" @click="hidenView">
            取消
          </el-button>
          <el-button class="handle-button" type="primary" @click="action.type ==='create' ? createData() : updateData()">
            确认
          </el-button>
        </div>

    </flexbox>
    </create-view>
</template>

<script>
import { fetchInformation, updateInformation, createInformation } from '@/api/information'
import { fetchTagList, createTag } from '@/api/tag'
import CreateView from '../../../components/CreateView.vue'
import settings from '@/settings'
import { thisExpression } from '@babel/types'

export default {
  components: { CreateView },
  name: 'InformationForm',
  props: {
    /**
     * save:添加、update:编辑(action_id)
     */
    action: {
      type: Object,
      default: () => {
        return {
          type: 'save',
          id: ''
        }
      }
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑消息',
        create: '创建消息'
      },
      rules: {
        title: [{ required: true, message: '必须填写标题', trigger: 'change' }],
        type: [{ required: true, message: '必须选择消息类型', trigger: 'change' }],
      },
      tableKey: 0,
      temp: {
        id: undefined,
        title: '',
        type: 1,
        reply: undefined,
        event: undefined,
        status: true,
        tags: [],
      },
      allTags: [],
			addTag: {
				value: ''
			},
      loading: false,
      types: settings.informationTypes,
			inputVisible: false,
			inputValue: '',
    }
  },
  created() {
    this.getInformation()
  },
  methods: {
		handleChange(){
			this.addTag.value = this.inputValue
			createTag(this.addTag).then((res) => {
				this.$notify({
					title: 'Success',
					message: '创建标签成功',
					type: 'success',
					duration: 2000
				})
				this.temp.tags.push(res.data)
				this.allTags.push(res.data)
			}).catch(() => {
				this.$notify({
					title: 'Error',
					message: '创建标签失败',
					type: 'error',
					duration: 2000
				})
			})
			this.inputVisible = false;
			this.inputValue = '';
		},
		handleSelect(item) {
			if (this.temp.tags.findIndex((tag)=>{return tag.id===item.id})==-1) {
				this.temp.tags.push(item)
			}else{
				this.$notify({
					title: 'Error',
					message: '已存在此标签',
					type: 'error',
					duration: 2000
				})
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
		querySearch(queryString, cb) {
			var tags = this.allTags;
			var results = queryString ? tags.filter(this.createFilter(queryString)) : tags;
			// 调用 callback 返回建议列表的数据
			cb(results);
		},
		createFilter(queryString) {
			return (tag) => {
				return (tag.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
			};
		},
		handleClose(tag) {
        this.temp.tags.splice(this.temp.tags.indexOf(tag), 1);
      },
		showInput() {
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
    getInformation() {
			this.loading = true
      fetchTagList().then(res => {
        this.allTags = res.data.items
				this.loading = false
      }).catch(() => {
				this.loading = false
			})
			if (this.action.type == 'update') {
				this.loading = true
        var id = this.action.id
        fetchInformation(id).then(res => {
					this.temp = res.data
					this.allTags = this.allTags.filter((item) =>
						!res.data.tags.some((ele) => ele.id === item.id)
					);
					this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    hidenView() {
      this.$emit('hiden-view')
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createInformation(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$emit('save-success')
            this.hidenView()
            this.$notify({
              title: 'Success',
              message: '创建消息成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateInformation(tempData).then(() => {
            this.dialogFormVisible = false
            this.$emit('save-success')
            this.hidenView()
            this.$notify({
              title: 'Success',
              message: '更新消息成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.crm-create-container {
  position: relative;
  height: 100%;
}

.crm-create-flex {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
}

.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    width: 40px;
    height: 40px;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
}

.handle-bar {
  position: relative;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}
.el-tag{
  margin-right: 10px;
}

</style>

