class CustomAccessLogFormat(str):
    def __mod__(self, other):
        # 如果是OPTIONS请求，返回空字符串
        if other['r'].split()[0] == 'OPTIONS':
            return ''
        return super().__mod__(other)

access_log_format = CustomAccessLogFormat('%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"')