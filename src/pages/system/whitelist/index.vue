<template>
  <div class="list-common-table">
    <t-form
      ref="form"
      :data="formData"
      :label-width="80"
      colon
      :style="{ marginBottom: '8px' }"
      @reset="handleReset"
      @submit="handleSubmit"
    >
      <t-row>
        <t-col :span="8">
          <t-row :gutter="[16, 24]">
            <t-col :span="4">
              <t-form-item label="分类" name="category">
                <t-select
                  v-model="formData.category"
                  class="form-item-content"
                  :options="WHITELIST_OPTIONS"
                  placeholder="请选择分类"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="授权资源" name="resource">
                <t-input
                  v-model="formData.resource"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入资源"
                  clearable
                  :style="{ minWidth: '80px' }"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>

        <t-col :span="4" class="operation-container">
          <t-button v-permission="'system.whitelist.read'" theme="primary" type="submit" :style="{ marginLeft: '8px' }">
            查询
          </t-button>
          <t-button v-permission="'system.whitelist.read'" type="reset" variant="base" theme="default"> 重置</t-button>
          <t-button v-permission="'system.whitelist.create'" theme="primary" @click="handleCreate">
            <t-icon name="add" />
            新建
          </t-button>
          <t-button v-permission="'system.whitelist.delete'" theme="danger" @click="handleDelete">
            <t-icon name="delete" />
            删除
          </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table
        v-permission="'system.whitelist.read'"
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        :vertical-align="verticalAlign"
        :hover="hover"
        :pagination="pagination"
        :loading="dataLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :selected-row-keys="selectedRowKeys"
        @select-change="handleSelectChange"
        @page-change="handlePageChange"
      >
        <template #category="{ row }">
          <t-tag theme="success" variant="light"
            >{{ WHITELIST_OPTIONS.find((item: any) => item.value === row.category).label }}
          </t-tag>
        </template>
        <template #op="slotProps">
          <a v-permission="'system.whitelist.update'" class="t-button-link" @click="handleRowEdit(slotProps)">编辑</a>
          <a v-permission="'system.whitelist.delete'" class="t-button-link" @click="handleRowDelete(slotProps)">删除</a>
        </template>
      </t-table>
      <t-dialog
        v-model:visible="deleteVisible"
        :header="deleteHeader"
        :on-cancel="cancelDelete"
        @confirm="confirmDelete"
      />
      <t-dialog v-model:visible="editVisible" :header="editHeader" :on-cancel="cancelEdit" @confirm="confirmEdit">
        <t-form :data="editFormData">
          <t-form-item label="分类" name="category">
            <t-select v-model="editFormData.category" placeholder="请选择分类" class="demo-select-base" clearable>
              <t-option v-for="(item, index) in WHITELIST_OPTIONS" :key="index" :value="item.value" :label="item.label">
                {{ item.label }}
              </t-option>
            </t-select>
          </t-form-item>
          <t-form-item label="授权资源" name="resource">
            <t-textarea
              v-model="editFormData.resource"
              placeholder="请输入内容(1行表示1个资源)"
              :autosize="{ minRows: 5 }"
            />
          </t-form-item>
        </t-form>
      </t-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useSettingStore } from '@/store';
import { prefix } from '@/config/global';
import { createWhitelist, deleteWhitelist, findWhitelist, updateWhitelist } from '@/api/whitelist';
import { authIdempotent } from '@/api/idempotent';
import { WHITELIST_OPTIONS } from '@/constants';

const store = useSettingStore();

const rowKey = 'id';
const verticalAlign = 'top';
const hover = true;
const pagination = ref({
  pageSize: 20,
  total: 100,
  current: 1,
});
const COLUMNS = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  {
    title: '序号',
    colKey: 'id',
    fixed: 'left',
    width: 220,
    ellipsis: true,
    align: 'left',
  },
  {
    title: '分类',
    colKey: 'category',
    width: 150,
  },
  {
    title: '授权资源',
    colKey: 'resource',
    width: 300,
    ellipsis: true,
  },
  {
    align: 'left',
    fixed: 'right',
    width: 200,
    colKey: 'op',
    title: '操作',
  },
];

const searchForm = {
  code: '',
  word: '',
  resource: '',
};
const editForm = {
  name: '',
  word: '',
  resource: '',
  menu: '',
  btn: '',
};
const formData = ref({ ...searchForm });
const editFormData = ref({ ...editForm });
const deleteVisible = ref(false);
const deleteHeader = ref('');
const editVisible = ref(false);
const editHeader = ref('');
const isEdit = ref(false);
const data = ref([]);
const selectedRowKeys = ref([]);
const dataLoading = ref(false);
const idempotentToken = ref('');

const refreshIdempotentToken = async () => {
  try {
    const { token } = await authIdempotent();
    idempotentToken.value = token;
  } catch (e) {
    console.log(e);
  }
};

const fetchData = async () => {
  dataLoading.value = true;
  const params = {
    ...formData.value,
    'page.num': pagination.value.current,
    'page.size': pagination.value.pageSize,
  };
  try {
    const { list, page } = await findWhitelist(params);
    data.value = list;
    pagination.value = {
      current: Number(page.num),
      pageSize: Number(page.size),
      total: Number(page.total),
    };
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

const deleteIdx = ref(-1);

const resetIdx = () => {
  deleteIdx.value = -1;
};

const confirmDelete = async () => {
  await deleteByIds([deleteIdx.value]);
};

const cancelDelete = () => {
  resetIdx();
};

const showEdit = async (row) => {
  if (row) {
    editFormData.value = row;
    editHeader.value = `编辑"${row.id}"`;
  } else {
    editHeader.value = '新增';
    await refreshIdempotentToken();
  }
  editVisible.value = true;
};

const cancelEdit = () => {
  editVisible.value = false;
};

const doCreate = async () => {
  try {
    await createWhitelist(idempotentToken.value, editFormData.value);
    MessagePlugin.success('新建成功');
    await fetchData();
    editVisible.value = false;
  } catch (e) {
    if (e.response && e.response.data && e.response.data.message) {
      MessagePlugin.error(e.response.data.message);
    }
  } finally {
    dataLoading.value = false;
  }
};

const doEdit = async () => {
  try {
    await updateWhitelist(editFormData.value);
    MessagePlugin.success('修改成功');
    await fetchData();
    editVisible.value = false;
  } catch (e) {
    if (e.response && e.response.data && e.response.data.message) {
      MessagePlugin.error(e.response.data.message);
    }
  } finally {
    dataLoading.value = false;
  }
};

const confirmEdit = async () => {
  if (isEdit.value) {
    await doEdit();
  } else {
    await doCreate();
  }
};

const deleteByIds = async (ids) => {
  if (ids.length === 0) {
    MessagePlugin.warning('请至少选择一条数据');
    return;
  }
  try {
    await deleteWhitelist(ids);
    MessagePlugin.success('删除成功');
    deleteVisible.value = false;
    resetIdx();
    await fetchData();
  } catch (e) {
    if (e.response && e.response.data && e.response.data.message) {
      MessagePlugin.error(e.response.data.message);
    }
  } finally {
    selectedRowKeys.value = [];
  }
};

const handleRowEdit = ({ row }) => {
  isEdit.value = true;
  showEdit(row);
};

const handleRowDelete = ({ row }) => {
  deleteIdx.value = row.id;
  deleteHeader.value = `删除"${row.id}", 不可恢复?`;
  deleteVisible.value = true;
};

const handleCreate = ({ row }) => {
  isEdit.value = false;
  editFormData.value = editForm;
  showEdit(row);
};

const handleDelete = async () => {
  await deleteByIds(selectedRowKeys.value);
};

const handleSelectChange = (value) => {
  selectedRowKeys.value = value;
};

const handleReset = () => {};

const handleSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    await fetchData();
  }
};

const handlePageChange = (curr) => {
  pagination.value.current = curr.current;
  pagination.value.pageSize = curr.pageSize;
  fetchData();
};

onMounted(() => {
  fetchData();
});

const offsetTop = computed(() => {
  return store.isUseTabsRouter ? 48 : 0;
});

const getContainer = () => {
  return document.querySelector(`.${prefix}-layout`);
};
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
