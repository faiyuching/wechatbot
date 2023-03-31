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
          <div style="flex:1;font-size:17px;color:#333;">{{ this.textMap[action.type]}}</div>
          <img
            class="close"
            src="@/assets/img/task_close.png"
            @click="hidenView" >
        </flexbox>
        <div class="crm-create-flex">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="85px" style="width: 440px; margin-left:50px;">
            <el-form-item label="名称" prop="link_title">
              <el-input v-model="temp.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="消息类型">
              <el-radio-group v-model="temp.type">
                <el-radio :label="1">文字</el-radio>
                <el-radio :label="2">图文</el-radio>
                <el-radio :label="3">入群邀请</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="内容">
              <el-input v-if="temp.type==1" v-model="temp.reply.text" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" />
              <div v-if="temp.type==1" class="tips"><span v-pre>{{username}}</span>将会被替换为成员昵称</div>
              <el-row v-if="temp.type==2">
                <el-input class="content2-input" placeholder="请输入卡片链接的网址" v-model="temp.reply.url"/>
                <el-input class="content2-input" placeholder="请输入标题" v-model="temp.reply.title"/>
                <el-input class="content2-input" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入标题所不能尽述的内容" v-model="temp.reply.description"/>
                <el-upload
                  name="file"
                  ref="upload"
                  :action="uploadUrl"
                  :headers="this.headers"
                  list-type="picture"
                  accept="image/jpeg,image/png,image/jpg"
                  :limit="1"
                  :on-exceed="uploadExceed"
                  :on-error="uploadError"
                  :on-success="uploadSuccess"
                  :on-remove="uploadRemove"
                  :auto-upload="true"
                  :file-list="this.temp.reply.thumbnailUrl">
                <el-button size="small" type="primary">上传图片</el-button>
                <span slot="tip" class="el-upload__tip">只能上传 jpg/png 文件，且不超过2M</span>
                </el-upload>
              </el-row>
            </el-form-item>
            <el-transfer
              v-if="temp.type==3"
              style="width: 600px; margin-bottom: 10px;"
              filterable
              :filter-method="filterMethod"
              filter-placeholder="请输入群组名称"
              :titles="['所有群组', '已选群组']"
              v-model="temp.reply.groupIds"
              :props="{ key: 'id',label: 'name'}"
              :data="allGroups">
            </el-transfer>
            <el-form-item label="标签">
							<el-autocomplete v-if="tagInputVisible" size="small" v-model="tagInput" ref="saveTagInput" :fetch-suggestions="querySearch" placeholder="回车创建新标签" @select="handleTagSelect" @change="handleTagChange"></el-autocomplete>
							<el-button v-else size="small" @click="showInput">+ 添加标签</el-button><br>
							<el-tag :key="tag.id" v-for="tag in temp.tags" closable  @close="handleTagClose(tag)">{{tag.value}}</el-tag>
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
import { fetchRoomList } from '@/api/group'
import { fetchTagList, createTag } from '@/api/tag'
import { createFile, updateFile } from '@/api/file'
import { getToken } from '@/utils/auth'
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
        name: [{ required: true, message: '必须填写标题', trigger: 'change' }],
        type: [{ required: true, message: '必须选择消息类型', trigger: 'change' }],
      },
      tableKey: 0,
      temp: {
        id: undefined,
        name: '',
        type: 1,
        reply: {
					text: '',
					title: '',
					description: '',
					thumbnailUrl: [],
					url: '',
					groupIds: [],
				},
        tags: [],
      },
      allTags: [],
			addTag: {
				value: ''
			},
      loading: false,
      types: settings.informationTypes,
			tagInputVisible: false,
			tagInput: '',
      headers: {Authorization: 'Bearer ' + getToken()},
      allGroups: [],
      filterMethod(query, item) {
        return item.name.indexOf(query) > -1;
      },
      uploadUrl: process.env.VUE_APP_BASE_API + '/information/uploadFile'
    }
  },
  created() {
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
        res.data.reply = JSON.parse(res.data.reply)
				this.temp = res.data
				this.allTags = this.allTags.filter((item) =>
					!res.data.tags.some((ele) => ele.id === item.id)
				);
			}).catch(() => {
				this.loading = false
			})
		}
    fetchRoomList({limit:1000}).then(res => {
      this.allGroups = res.data.items
    }).catch((err) => {
      this.loading = false
    });
  },
  methods: {
    uploadRemove(){
      this.temp.reply.thumbnailUrl.pop()
    },
    uploadSuccess(res){
      this.temp.reply.thumbnailUrl.push({
        name: res.data.name,
        url: res.data.url
      })
    },
    uploadError(){
      this.$notify({
        title: 'Error',
        message: '上传失败',
        type: 'error',
        duration: 2000
      })
    },
    uploadExceed(){
      this.$notify({
        title: 'Error',
        message: '只能上传一张图片',
        type: 'error',
        duration: 2000
      })
    },
		handleTagChange(){
			this.addTag.value = this.tagInput
			createTag(this.addTag).then((res) => {
				this.$notify({
					title: 'Success',
					message: '创建标签成功',
					type: 'success',
					duration: 2000
				})
				this.temp.tags.push(res.data)
			}).catch(() => {
				this.$notify({
					title: 'Error',
					message: '创建标签失败',
					type: 'error',
					duration: 2000
				})
			})
			this.tagInputVisible = false;
			this.tagInput = '';
		},
		handleTagSelect(item) {
			if ( this.temp.tags.findIndex((tag)=>{return tag.id===item.id}) == -1 ) {
				this.temp.tags.push(item)
				this.allTags.splice(this.allTags.findIndex((tag)=>{return tag.id===item.id}), 1)
			}else{
				this.$notify({
					title: 'Error',
					message: '已存在此标签',
					type: 'error',
					duration: 2000
				})
			}
			this.tagInputVisible = false;
			this.tagInput = '';
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
		handleTagClose(tag) {
        this.temp.tags.splice(this.temp.tags.indexOf(tag), 1);
				this.allTags.push(tag)
      },
		showInput() {
			this.tagInputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
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
  overflow-x: auto;
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
.content2-input{
	margin-bottom: 10px;
}

.el-upload__tip{
  margin-left: 10px;
}

.tips{
  font-size: small;
  color: darkgrey;
}
</style>

