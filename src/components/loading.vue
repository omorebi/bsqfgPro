<template>
	<div>
		<div class="mask"></div>
		<div class="loading">
			<div class="loading_icon">
				<div class="loading_icon--spinner" v-for="(v, i) in (type === 'spinner' ? 12 : 0)" :key="i"></div>
				<svg class="loading_icon--circular" v-if="type === 'circular'" viewBox="25 25 50 50">
					<circle cx="50" cy="50" r="20" fill="none" />
				</svg>
			</div>
			<div class="loading_text" v-if="message!== undefined && message !== null">
				{{ message }}
			</div>
		</div>
	</div>
</template>
<script>
export default {
  name: 'loading',
  props: {
    type: {
      type: String,
      default: "spinner"
    },
    message: {
      type: [String, Number],
      default: "加载中..."
    },
  },
  data() {
    return {}
  }
}

</script>
<style lang="scss" scoped>
$centerRadius: 34px;
$itemWidth: 14px;
$itemHeight: 3px;
$width: $centerRadius+$itemWidth * 2;
$height: $width;

.mask {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
	background-color: rgba(0, 0, 0, .3);
}

.loading {
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: 1000;
	display: flex;
	color: #fff;
	max-width: 70%;
	font-size: 28px;
	line-height: 28px;
	border-radius: 4px;
	word-break: break-all;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	box-sizing: content-box;
	transform: translate3d(-50%, -50%, 0);
	background-color: rgba(0, 0, 0, .8);
	// hack for avoid max-width when use left & fixed
	width: 240px;
	padding: 15px;
	min-height: 240px;
	border-radius: 14px;

	&_icon {
		width: $width;
		height: $height;
		position: relative;


		&--spinner {
			width: $itemWidth;
			height: $itemHeight;
			margin-top: $itemHeight / 2 * -1;
			margin-left: $centerRadius / 2;
			top: 50%;
			left: 50%;
			border-radius: 40%;
			position: absolute;
			background-color: #d1d1d5;
			transform-origin: ($centerRadius / 2 * -1) ($itemHeight / 2);

			@for $i from 1 through 12 {
				&:nth-child(#{$i}) {
				transform: rotate(($i - 1) * 30deg);
				animation: loading-spinner 1s linear infinite #{-1 + $i / 12}s;
				}
			}

			@at-root {
				@keyframes loading-spinner {
				0% {
					opacity: 1;
				}

				@for $i from 1 through 11 {
					#{$i / 12 * 100}% {
					opacity: 1 - $i / 12;
					}
				}

				100% {
					opacity: 1;
				}
				}
			}
		}

		&--circular {
			width: 100%;
			height: 100%;
			animation: loading-rotate 1.8s linear infinite;

			@keyframes loading-rotate {
				from {
					transform: rotate(0deg);
				}

				to {
					transform: rotate(360deg);
				}
			}

			circle {
				stroke: currentColor;
				stroke-width: 3;
				stroke-linecap: round;
				animation: loading-circular 1.5s ease-in-out infinite;
			}

			@keyframes loading-circular {
				0% {
					stroke-dasharray: 1, 200;
					stroke-dashoffset: 0;
				}

				50% {
					stroke-dasharray: 90, 150;
					stroke-dashoffset: -40;
				}

				100% {
					stroke-dasharray: 90, 150;
					stroke-dashoffset: -120;
				}
			}
		}
	}

	&_text {
		margin-top: 30px;
	}
}

</style>
