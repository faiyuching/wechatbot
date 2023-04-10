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
            <el-form-item label="发送时间">
              <el-date-picker
                v-model="temp.post_at"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="选择群"></el-form-item>
            <el-transfer
              style="width: 600px; margin-bottom: 20px;"
              filterable
              :filter-method="filterGroup"
              filter-placeholder="请输入群组名称"
              :titles="['所有群组', '已选群组']"
              v-model="temp.group_ids"
              :props="{ key: 'id',label: 'name'}"
              :data="allGroups">
            </el-transfer>
            <el-form-item label="选择消息"></el-form-item>
            <el-transfer
              style="width: 600px;"
              filterable
              :filter-method="filterInformation"
              filter-placeholder="请输入消息名称"
              :titles="['所有消息', '已选消息']"
              v-model="temp.info_ids"
              :props="{ key: 'id',label: 'name'}"
              :data="allInformations">
            </el-transfer>
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
import { fetchInformationList } from '@/api/information'
import { fetchRoomList } from '@/api/group'
import { fetchBulkMessage, createBulkMessage, updateBulkMessage } from '@/api/bulk_message'
import CreateView from '../../../components/CreateView.vue'
import settings from '@/settings'

export default {
  components: { CreateView },
  name: 'BulkMessageForm',
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
        update: '编辑群发消息',
        create: '创建群发消息'
      },
      rules: {
        keyword: [{ required: true, message: '必须填写关键词', trigger: 'change' }],
        type: [{ required: true, message: '必须选择关键词类型', trigger: 'change' }],
      },
      tableKey: 0,
      temp: {
        info_ids: [],
        group_ids: [],
        post_at: '',
        status: 0,
      },
      loading: false,
      allGroups: [],
      allInformations: [],
      allContacts: [],
      groupName: '',
      filterGroup(query, item) {
        return item.name.indexOf(query) > -1;
      },
      filterInformation(query, item) {
        return item.name.indexOf(query) > -1;
      },
    }
  },
  created() {
    this.loading = true
    fetchRoomList({limit:0}).then(res => {
      this.allGroups = res.data.items
    }).catch((err) => {
      this.loading = false
    });
    fetchInformationList({limit:0}).then(res => {
      this.allInformations = res.data.items
      this.allInformations.forEach(info => {
        if(info.type == 3){
          info.disabled = true
        }
      });
    }).catch((err) => {
      this.loading = false
    });
    if (this.action.type == 'update') {
      var id = this.action.id
      fetchBulkMessage(id).then(res => {
        this.temp = res.data
      }).catch(() => {
        this.loading = false
      })
    }
    this.loading = false
  },
  methods: {
    hidenView() {
      this.$emit('hiden-view')
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createBulkMessage(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$emit('save-success')
            this.hidenView()
            this.$notify({
              title: 'Success',
              message: '创建群发消息成功',
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
          updateBulkMessage(tempData).then(() => {
            this.dialogFormVisible = false
            this.$emit('save-success')
            this.hidenView()
            this.$notify({
              title: 'Success',
              message: '更新群发消息成功',
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

