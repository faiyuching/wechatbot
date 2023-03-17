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
import CreateView from '../../../components/CreateView.vue'
import settings from '@/settings'

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
      },
      loading: false,
      types: settings.informationTypes,
    }
  },
  created() {
    this.getInformation()
  },
  methods: {
    getInformation() {
      if (this.action.type == 'update') {
        this.loading = true
        var id = this.action.id
        fetchInformation(id).then(res => {
          this.temp = res.data
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

</style>

