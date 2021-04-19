<template>
  <div class="about">
    <div>
      <a-input style="margin: 0 5px 0 0;" v-model="msg" placeholder="请输入事项内容"/>
      <a-button style="margin: 0 0 0 5px;" @click="handleSubmit" type="primary">
        添加事项
      </a-button>
    </div>
    <div class="content">
      <div v-for="item in curData">
        <div style="float: left">
          <a-checkbox :item-id="item.id" :checked="item.done" @change="onChange(item.id)"/>
          <p class="text">
            {{ item.info }}</p>
        </div>
        <a :item-id="item.id" style="float: right" @click="handleDelete(item.id)">删除</a>
      </div>
      <p v-show="!empty" style="padding: 10px;font-size: 12px;color: #d4d4d4">没有更多数据了~</p>
      <a-empty v-show="empty" description="暂无数据" style="border: none;margin-top:60px" />
    </div>
    <div>
      <span>{{ count }}条剩余</span>
      <a-radio-group default-value="a" button-style="solid">
        <a-radio-button value="a" @click="getAll">
          全部
        </a-radio-button>
        <a-radio-button value="b" @click="getUnfinished">
          未完成
        </a-radio-button>
        <a-radio-button value="c" @click="getFinished">
          已完成
        </a-radio-button>
      </a-radio-group>
      <a @click="clearFinished">清除已完成</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'About',
  data() {
    return {
      curData: [],
      empty: false,
      checked: true,
      countId: 0,
      msg: '',
      count: 0,
      curCard: 0,
    }
  },
  mounted: function() {
    this.loadData();
    // 在渲染页面后立即检查数据是否为空
    this.showEmpty();
  },
  watch: {
    // 监控当前的数据变化，检查数据是否为空
      curData: 'showEmpty',
  },
  methods: {
    // 装载数据到当前页面的数据curData中，并更新添加时候的统计ID值
    loadData: function () {
      this.curData = [...this.$store.state.todoList];
      this.count = this.curData.length;
      this.updateCountId();
    },
    // 在操作后调用，即可更新数据到根数据源
    updateData: function ( data ) {
      this.$store.state.todoList= [...data ];
    },
    // 判断当前筛选选项卡，更新数据（添加、删除、清除后要调用）
    updateCard: function () {
      if (this.curCard === 0) {
        this.getAll();
      } else if (this.curCard === 1 ) {
        this.getUnfinished();
      } else {
        this.getFinished();
      }
    },
    // 更新统计ID值的函数，从数据源中获取到最大ID并加1
    updateCountId: function () {
      let maxID = Math.max(...this.curData.map(item => item.id));
      this.countId = maxID + 1;
    },
    // 用于判断当前筛选选项卡的数据是否为空，为空展示暂无数据的插画
    showEmpty: function () {
      if(this.curData.length === 0) {
        this.empty = true;
        return;
      }
      this.empty = false;
    },
    // 提交todo事项的函数
    handleSubmit: function () {
      // 判断事项是否为空，阻断后并提示
      if(this.msg === "") {
        this.$message.error('请输入事项内容！');
        return;
      }
      // 判断事项是否为一个或多个空格，阻断后并提示
      if(this.msg.replace(/\s+/g, '') === "") {
        this.$message.error('请输入事项内容，而不只是空格。');
        return;
      }
      // 更新数据模板到数据源
      this.$store.state.todoList.push(
          {
            "id": this.countId,
            "info": `${this.msg}`,
            "done": false
          }
      )
      // 恢复初始值，统计ID值加1
      this.msg = '';
      this.countId++;
      // 更新当前选项卡数据
      this.updateCard();
      // 如果选项卡为“已完成”，增添提示去“全部”的选项卡查看添加的todo事项
      // 否则，按照默认消息提示
      let addNote = '';
      if (this.curCard === 2)
        addNote = ",请点击“全部”后查看"
      this.$message.success(`添加成功${addNote}！`);
    },
    // 用于切换完成与未完成的勾选
    onChange: function (id) {
      let length = this.$store.state.todoList.length;
      for(let i=0; i<length; i++){
        let item = this.$store.state.todoList[i];
        if (item.id === id) {
          item.done = !item.done;
        }
      }
      // 更新当前选项卡数据
      this.updateCard();
    },
    // 删除todo事项的函数
    handleDelete: function (id) {
      // 当前选项卡页面数据进行筛选展示
      this.curData = this.curData.filter(item => item.id !== id);
      // 再让数据源数据进行筛选并更新
      let data = this.$store.state.todoList.filter(item => item.id !== id)
      this.updateData(data);
      this.$message.success('删除成功！');
      // 更新添加的统计ID值
      this.updateCountId();
    },
    // “全部”筛选选项卡事件，代码0
    getAll: function () {
      this.curCard = 0;
      // 直接重新加载全部数据不需要筛选（为了防止增加、删除等操作产生的数据变化）
      this.loadData();
    },
    // “未完成”筛选选项卡事件，代码1
    getUnfinished: function () {
      this.curCard = 1;
      // 重新加载全部数据并筛选（为了防止勾选、增加、删除等操作产生的数据变化）
      this.loadData();
      this.curData = this.curData.filter(item => item.done === false);
    },
    // “已完成”筛选选项卡事件，代码2
    getFinished: function () {
      this.curCard = 2;
      // 重新加载全部数据并筛选（为了防止勾选、增加、删除等操作产生的数据变化）
      this.loadData();
      this.curData = this.curData.filter(item => item.done === true);
    },
    // 清除全部已完成事项的函数
    clearFinished: function () {
      if (this.$store.state.todoList.filter(item => item.done === true).length === 0) {
        this.$message.warning('您还没有已完成的事项，请先去完成吧！');
        return;
      }
      // 清除curData数据（页面展示）后，利用筛选清除源数据的完成项
      let data = this.$store.state.todoList.filter(item => item.done !== true);
      this.updateData(data);
      // 更新当前选项卡数据
      this.updateCard();
      this.$message.success("已清除全部已完成的事项！");
    }
  }
}
</script>
<style scoped>
.about {
  margin: 0 auto;
  width: 600px;
}

.about > div:first-child {
  display: flex;
  flex-direction: row;
}

.content {
  margin-top: 10px;
  height: 300px;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
  overflow-y: auto;
}

.content > div {
  padding: 20px 20px 40px 20px;
  border-bottom: 1px solid #d4d4d4;
}

.content > div > div {
  display: flex;
  flex-direction: row;
}

.about > div:last-child {
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #d4d4d4;
  border-radius: 0 0 5px 5px;
}

.text {
  margin: 0 10px;
  text-overflow: ellipsis;
  width: 470px;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
}
</style>
