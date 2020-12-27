{{/* Create chart name and version as used by the chart label. */}}
{{- define "app.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "app.fullname" -}}
{{ .Release.Name }}
{{- end -}}

{{/* Common labels */}}
{{- define "app.labels" -}}
app.kubernetes.io/name: {{ required "app.name variable is required" .Values.app.name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ required "app.version variable is required" .Values.app.version | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ include "app.chart" . }}
{{- end -}}

{{/* Match labels to find this instance */}}
{{- define "app.matchLabels" -}}
app.kubernetes.io/name: {{ .Values.app.name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/* Selector labels for load balancing */}}
{{- define "app.selector" -}}
app.kubernetes.io/name: {{ .Values.app.name }}
{{- end -}}
