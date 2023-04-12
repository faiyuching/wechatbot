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
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <el-form-item label="选择群" v-if="this.action.type == 'create'"></el-form-item>
            <el-transfer
              v-if="this.action.type == 'create'"
              style="width: 600px; margin-bottom: 10px;"
              filterable
              :filter-method="filterGroup"
              filter-placeholder="请输入群组名称"
              :titles="['所有群组', '已选群组']"
              target-order="push"
              v-model="temp.roomIds"
              :props="{ key: 'id',label: 'name'}"
              :data="allGroups">
            </el-transfer>
            <el-form-item v-if="this.action.type == 'create'" label="选择消息"></el-form-item>
            <div style="margin-bottom: 20px;font-weight: bold;" v-else>{{ this.groupName }}</div>
            <el-transfer
              style="width: 600px;"
              filterable
              :filter-method="filterInformation"
              filter-placeholder="请输入消息名称"
              :titles="['所有消息', '已选消息']"
              target-order="push"
              v-model="temp.infoIds"
              :data="allInformations"
              :props="{ key: 'id',label: 'name'}">
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
import { fetchRoom, fetchRoomList } from '@/api/group'
import { fetchInformationList } from '@/api/information'
import { createInformation, fetchRoomInfoList, updateRoomInfo } from '@/api/room_information'
import { fetchAllFile } from '@/api/file'
import CreateView from '../../../components/CreateView.vue'

export default {
  components: { CreateView },
  name: 'WelcomeForm',
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
        update: '编辑欢迎语',      
        create: '创建欢迎语'
      },
      rules: {
        room_ident: [{ required: true, message: '必须选择微信群', trigger: 'change' }],
      },
      tableKey: 0,
      temp: {
        room_id: undefined,
        roomIds: [],
        infoIds: [],
      },
      loading: false,
      allGroups: [],
      allInformations: [],
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
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
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
      if (this.action.type == 'create') {
        fetchRoomList({limit:0}).then(res => {
          this.allGroups = res.data.items
        }).catch((err) => {
          this.loading = false
        });
      }
      if (this.action.type == 'update') {
        fetchRoom({id: this.action.id}).then(res => {
          this.temp.room_id = res.data.id
          this.groupName = res.data.name
        }).catch((err) => {
          this.loading = false
        });
        fetchRoomInfoList({room_id: this.action.id}).then(res => {
          res.data.items.forEach(item => {
            this.temp.infoIds.push(item.information_id)
          });
        }).catch((err) => {
          this.loading = false
        });
      }
      this.loading = false
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
              message: '创建欢迎语成功',
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
          updateRoomInfo(tempData).then(() => {
            this.dialogFormVisible = false
            this.$emit('save-success')
            this.hidenView()
            this.$notify({
              title: 'Success',
              message: '更新欢迎语成功',
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