<template>
  <t-space direction="vertical">
    <t-space>
      <t-checkbox v-model="disabled">禁用状态</t-checkbox>
      <t-checkbox v-model="autoUpload">自动上传</t-checkbox>
      <t-checkbox v-model="showThumbnail">显示文件缩略图</t-checkbox>
      <t-checkbox v-model="allowUploadDuplicateFile"> 允许上传同名文件 </t-checkbox>
      <t-checkbox v-model="isBatchUpload"> 整体替换上传 </t-checkbox>
      <t-checkbox v-model="uploadAllFilesInOneRequest"> 多个文件一个请求上传 </t-checkbox>
    </t-space>

    <br />

    <t-upload
      ref="uploadRef"
      v-model="files"
      :request-method="requestMethod"
      placeholder="支持批量上传文件，文件格式不限，最多只能上传 10 份文件"
      theme="file-flow"
      :disabled="disabled"
      :abridge-name="ABRIDGE_NAME"
      :auto-upload="autoUpload"
      :max="10"
      :show-thumbnail="showThumbnail"
      :allow-upload-duplicate-file="allowUploadDuplicateFile"
      :is-batch-upload="isBatchUpload"
      :upload-all-files-in-one-request="uploadAllFilesInOneRequest"
      :format-response="formatResponse"
      multiple="true"
    ></t-upload>

    <t-link theme="primary" href="//minio.go-cinch.top/browser/test" target="_blank"> 点击查看Minio </t-link>
    <t-tag>用户名: cinch</t-tag>
    <t-tag>密码: cinch123456</t-tag>
  </t-space>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { UploadProps, UploadInstanceFunctions } from 'tdesign-vue-next';
import axios from 'axios';
import { preSigned } from '@/api/oss';

const files = ref<UploadProps['value']>([]);
const ABRIDGE_NAME: UploadProps['abridgeName'] = [10, 7];
const disabled = ref(false);
const autoUpload = ref(false);
const showThumbnail = ref(false);
const allowUploadDuplicateFile = ref(false);
const isBatchUpload = ref(false);
const uploadRef = ref<UploadInstanceFunctions>();
const uploadAllFilesInOneRequest = ref(false);
const formatResponse: UploadProps['formatResponse'] = (res) => {
  if (!res) {
    return {
      status: 'fail',
      error: '上传失败，原因：文件过大或网络不通',
    };
  }
  return res;
};
const requestSuccessMethod: UploadProps['requestMethod'] = (file) => {
  return new Promise(async (resolve): Promise<void> => {
    try {
      const preUpload = await preSigned({
        name: file[0].name,
        category: 1,
      });
      const formData = new FormData();
      formData.append('file', file[0].raw);

      try {
        const response = await axios.put(preUpload.uri, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          const uploaded = await preSigned({
            name: file[0].name,
            category: 0,
          });
          resolve({
            status: 'success',
            response: {
              url: uploaded.uri,
            },
          });
        } else {
          resolve({
            status: 'fail',
            response: {
              error: '上传失败，原因：文件过大或网络不通',
            },
          });
        }
      } catch (error) {
        resolve({
          status: 'fail',
          response: {
            error: '上传失败，原因：文件过大或网络不通',
          },
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('end');
    }
  });
};
const requestMethod = computed<UploadProps['requestMethod']>(() => requestSuccessMethod);
</script>
