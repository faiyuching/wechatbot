
<template>
  <div class="app-container">
    <div class="explain">
      <div class="title">好友欢迎语</div>
      <p class="">用户添加好友后，将会发送此欢迎语。</p>
    </div>

      <el-form ref="dataForm" v-loading="loading" :model="temp">
        <el-form-item>
          <el-transfer
            style="width: 600px;"
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入消息名称"
            :titles="['所有消息', '已选消息']"
            v-model="temp.infoIds"
            :data="allInformations"
            :props="{ key: 'id',label: 'name'}">
          </el-transfer>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateData">
            更新
          </el-button>
        </el-form-item>
      </el-form>

  </div>
</template>

<script>
import { fetchInformationList, setFriendWelcome } from '@/api/information'
import CreateView from '../../components/CreateView.vue'

export default {
  components: { CreateView },
  name: 'ContactWelcome',
  props: { },
  data() {
    return {
      temp: {
        infoIds: [],
      },
      loading: false,
      allInformations: [],
      filterMethod(query, item) {
        return item.name.indexOf(query) > -1;
      },
    }
  },
  created() {
    this.loading = true
    fetchInformationList({limit:0}).then(res => {
      this.allInformations = res.data.items
      res.data.items.forEach(item => {
        if(item.is_friend_welcome){
          this.temp.infoIds.push(item.id)
        }
      });
      this.loading = false
    }).catch((err) => {
      this.loading = false
    });
  },
  methods: {
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          setFriendWelcome(tempData).then(() => {
          this.$notify({
            title: 'Success',
            message: '更新成功',
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
.app-container {
  padding-bottom: 0;
}
.container {
  .title-container {
    margin: 30px;
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
