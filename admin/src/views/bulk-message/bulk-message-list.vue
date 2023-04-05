<template>
  <div class="app-container">
    <div class="explain">
      <div class="title">群发消息</div>
      <p class="">可一键发布消息到选定的微信群或私人</p>
      <!-- <p class="error-color">关键词会被缓存一小时，添加或者更新请清除缓存。</p> -->
    </div>

    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <!-- <el-button class="filter-item el-button--danger" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleClearCache">
        清除缓存
      </el-button> -->
    </div>

    <!-- 欢迎语列表页 START -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="200px">
        <template slot-scope="{row}">
          <el-popover
            placement="top-start"
            :title="types[item.type]"
            width="200"
            trigger="click"
            v-for="item in row.infos" v-bind:key="item.id">
            <div>{{ item.reply.text }}</div>
            <div>{{ item.reply.title }}</div>
            <div>{{ item.reply.description }}</div>
            <div>{{ item.reply.url }}</div>
            <el-tag slot="reference">{{ item.name }}</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="推送对象" min-width="100px" align="left">
        <template slot-scope="{row}">
          <div>{{ row.group_ids.length }}</div>
        </template>
      </el-table-column>
      <el-table-column label="类别" class-name="status-col" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ bkTypes[row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" min-width="150px" align="left">
        <template slot-scope="{row}">
          <p class="link-desc">{{ row.post_at }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100px" align="left">
        <template slot-scope="{row}">
          <span>{{ bkStatus[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 欢迎语列表页 END -->

    <bulk-message-form
      v-if="isCreate"
      :action="createActionInfo"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchBulkMessageList, deleteBulkMessage } from '@/api/bulk_message'
import { clearRedisCache } from '@/api/wechat'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import BulkMessageForm from './components/bulk-message-form'
import settings from '@/settings'

export default {
  name: 'AutoReplyList',
  components: { BulkMessageForm, Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
      },
      createActionInfo: { type: 'create' },
      isCreate: false, // 是创建
      tableHeight: document.documentElement.clientHeight - 320, // 表的高度
      types: settings.informationTypes,
      bkTypes: settings.bulkMessageTypes,
      bkStatus: settings.bulkMessageStatus,
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    var self = this
  },
  methods: {
    getList() {
      this.listLoading = true
      if (!this.listQuery.keyword) {
        this.listQuery.keyword = undefined
      }
      fetchBulkMessageList(this.listQuery).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.listLoading = false
      })
    },
    createSaveSuccess() {
      this.getList()
    },
    hideView() {
      this.isCreate = false
    },
    handleCreate() {
      this.createActionInfo = { type: 'create' }
      this.isCreate = true
    },
    handleUpdate(row) {
      this.createActionInfo = { type: 'update', id: row.id }
      this.isCreate = true
    },
    handleDelete(row, index) {
        this.$confirm('确定要删除这些数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteBulkMessage(row.id).then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功！',
                type: 'success',
                duration: 2000
              })
              this.list.splice(index, 1)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
    },
    handleClearCache(row, index) {
        this.$confirm('确定要所有缓存吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            clearRedisCache().then(() => {
              this.$notify({
                title: '成功',
                message: '清除成功！',
                type: 'success',
                duration: 2000
              })
              this.list.splice(index, 1)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding-bottom: 0;
}
.pagination-container {
  padding-bottom: 0;
}
.container {
  .title-container {
    margin: 30px;
    font-size: 30px;
    line-height: 46px;
  }
}
.title {
  font-size: 25px;
  font-weight: bolder;
}
.explain {
  margin-bottom: 5px;
}
.filter-container {
    padding-bottom: 10px;
}
.nickname {
  color: #f56c6c;
}
.not-img {
  color: #c0c4cc;
}
.link-box {
  display: flex;
  align-items: center;

  .link-right {
    flex: 1;
    margin-left: 10px;

    .link-title {
      font-size: 16px;
      margin: 5px 0;
    }
    .link-desc {
      font-size: 12px;
      color: #b2b2b2;
      margin: 5px 0;
    }
  }
}

.el-tag{
  margin-right: 10px;
}
</style>
